import React from "react";
import LocalForage from "localforage";

import DashBkgd from "./images/dash_digital-cash_logo_2018_rgb_for_screens.png";
import Image from "react-bootstrap/Image";

import ConnectToANetworkModal from "./components/TopNav/ConnectToANetworkModal";

import ConnectWalletModal from "./components/BottomNav/ConnectWalletModal";
import DisconnectWalletModal from "./components/BottomNav/DisconnectWalletModal";
import RegisterIdentityModal from "./components/BottomNav/RegisterIdentityModal";
import TopUpIdentityModal from "./components/BottomNav/TopUpIdentityModal";
import SearchForNameModal from "./components/BottomNav/SearchForNameModal";
import RegisterNameModal from "./components/BottomNav/RegisterNameModal";
import RegisterNameAliasModal from "./components/BottomNav/RegisterNameAliasModal";

import TopNav from "./components/TopNav/TopNav";
import BottomNav from "./components/BottomNav/BottomNav";

import LandingPage from "./components/Pages/LandingPage";

import Footer from "./components/Footer";

import "./App.css";

import CreateNewWalletModal from "./components/TopNav/CreateNewWalletModal";
import SendFundsModal from "./components/TopNav/SendFundsModal";
import ConnectedWalletPage from "./components/Pages/ConnectedWalletPage";

const Dash = require("dash");


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isLoadingNames: false,
      isLoadingButtons: false,
      mode: "dark",
      presentModal: "",
      isModalShowing: false,
      whichNetwork: "testnet",
      isMnemonicAvail: false,
      isIdentitiesAvail: false,
      isNamesAvail: false,
      mnemonic: "",
      identity: '',
      identityRaw: '',
      identityInfo: '',
      nameList: [],
      accountBalance: '', 
      accountAddress: '', 

      numberOfLocalForageKeys: '',
      skipSynchronizationBeforeHeight: 883000,

      mostRecentBlockHeight: 898000,
      expandedTopNav:false,
      expandedBottomNav: false
    };
  }

  handleExpandedNavs = (whichNav) =>{
    if(whichNav==="TopNav"){
      if(this.state.expandedTopNav){
        this.setState({expandedTopNav:false});
      }else{
        this.setState({
          expandedTopNav:true,
          expandedBottomNav:false
        })
      }
    }
    if(whichNav==="BottomNav"){
      if(this.state.expandedBottomNav){
        this.setState({expandedBottomNav:false});
      }else{
        this.setState({
          expandedBottomNav:true,
          expandedTopNav:false
        })
      }
    }

  }

  hideModal = () => {
    this.setState({
      isModalShowing: false,
    });
  };

  showModal = (modalName) => {
    this.setState({
      presentModal: modalName,
      isModalShowing: true,
    });
  };

  handleMode = () => {
    if (this.state.mode === "primary")
      this.setState({
        mode: "dark",
      });
    else {
      this.setState({
        mode: "primary",
      });
    }
  };

  handleSkipSyncLookBackFurther = () => {
    this.setState({
      skipSynchronizationBeforeHeight : this.state.skipSynchronizationBeforeHeight - 5000,
      isLoading: true
    },()=> this.handleLoginforRefreshWallet());
  }
  
  handleLoginforRefreshWallet = () => {

    const client = new Dash.Client({
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: this.state.mnemonic,
        adapter: LocalForage.createInstance,
        unsafeOptions: {
          skipSynchronizationBeforeHeight:
            this.state.skipSynchronizationBeforeHeight,
        },
      },
    });

    const retrieveIdentityIds = async () => {
      const account = await client.getWalletAccount();

      this.setState({
        accountBalance: account.getTotalBalance(),
        accountAddress: account.getUnusedAddress().address,
     });

      return account;
    };

    retrieveIdentityIds()
      .then((d) => {
        this.setState({
          isLoading:false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong getting Wallet:\n", e);
        this.setState({
          isLoading:false,
        });
      })
      .finally(() => client.disconnect());
  };

  triggerButtonLoading = () => {
    this.setState({
      isLoadingButtons:true,
    });
  }

  triggerNameLoading = () => {
    this.setState({
      isLoadingNames:true,
    });
  }

  //THIS SHOULD TRIGGER THE LOGIN PROCESS
  handleWalletConnection = (passphrase) => {
    this.setState({
      mnemonic: passphrase,
      isMnemonicAvail: true,
      isLoading: true,
      skipSynchronizationBeforeHeight: 883000
    }, () => this.retrieveIdentitiesfromWallet());
  };

//Experimental Feature

  handleNEWWalletConnection = (passphrase) => {
    this.setState({
      mnemonic: passphrase,
      isMnemonicAvail: true,
      isLoading: true,
      skipSynchronizationBeforeHeight: this.state.mostRecentBlockHeight,
    }, () => this.retrieveIdentitiesfromWallet());
  };

  handleWalletDisconnect = () => {
    this.setState({
      isLoading: false,
      isLoadingNames: false,
      isLoadingButtons: false,
      presentModal: "",
      isModalShowing: false,
      isMnemonicAvail: false,
      isIdentitiesAvail: false,
      isNamesAvail: false,
      mnemonic: "",
      identity: '',
      identityInfo: '',
      nameList: [],
      accountBalance: '', 
      accountAddress: '', 
    });
  };

  componentDidMount() {

    LocalForage.config({
      name: 'dashevo-wallet-lib'
  });

  LocalForage.keys().then((keys) => {
    this.setState({
      numberOfLocalForageKeys: keys.length,
    }
    ,()=>console.log(this.state.numberOfLocalForageKeys));
      
   
      console.log(keys);
  }).catch(function(err) {
      console.log(err);
  });
  

  LocalForage.ready().then(function() {
    
    console.log(LocalForage.driver()); 
}).catch(function (e) {
    console.log(e);
});

const clientOpts = {
  network: this.state.whichNetwork,
};

const client = new Dash.Client(clientOpts);

const getMostRecentBlockHeight = async () => {
  const status = await client.getDAPIClient().core.getStatus();

  return status;
};

getMostRecentBlockHeight()
  .then((d) => {
    let blockHeight = d.chain.blocksCount;
    console.log("Most Recent Block Height:\n", blockHeight);
    this.setState({
      mostRecentBlockHeight: blockHeight - 2500, 
    });
  })
  .catch((e) =>{ console.error("Something went wrong:\n", e);
})
  .finally(() => client.disconnect());

    }


  retrieveIdentitiesfromWallet = () => {
    if(!this.state.isLoading){
      this.setState({
        isLoading:true,
      });
    }

    const client = new Dash.Client({
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: this.state.mnemonic,
        adapter:   LocalForage.createInstance,
        unsafeOptions: {
          skipSynchronizationBeforeHeight: this.state.skipSynchronizationBeforeHeight,
        },
      },
    });

    const retrieveIdentityIds = async () => {
      const account = await client.getWalletAccount();

       this.setState({
          accountBalance: account.getTotalBalance(),
          accountAddress: account.getUnusedAddress().address,
       });

      return account.identities.getIdentityIds();
    };

    retrieveIdentityIds()
      .then((d) => {
        console.log("Mnemonic identities:\n", d);
        if(d.length === 0){
          this.setState({
            isLoading:false,
            isIdentitiesAvail: true,
          });
        }else{
        this.setState(
          {
            isIdentitiesAvail: true,
            identity: d[0],
          },
          () => this.getIdentityInfo()
        );
      }
      })
      .catch((e) =>{ console.error("Something went wrong:\n", e);
      this.setState(
        {
          isLoading: false,
        });
    })
      .finally(() => client.disconnect());
    
  }; 

  registerIdentity = () => {
    this.setState({
      isLoading: true,
    });
  
    const clientOpts = {
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: this.state.mnemonic,
        adapter: LocalForage.createInstance,
        unsafeOptions: {
          skipSynchronizationBeforeHeight: this.state.skipSynchronizationBeforeHeight,
        },
      },
    };
   
    const client = new Dash.Client(clientOpts);
    
    const createIdentity = async () => {
      return client.platform.identities.register();
    };

    createIdentity()
      .then((d) => {
        console.log("Identity:\n", d.toJSON());
        let idInfo = d.toJSON();
          this.setState(
            { identity: idInfo.id,
              identityInfo: idInfo,

              //TEST For Faster Name Submission
              identityRaw: d,
              //TEST For Faster Name Submission

              isLoading: false,
              accountBalance: this.state.accountBalance - 1000000
            },
            () => console.log(this.state.identityInfo)
          );
      })
      .catch((e) =>{ console.error("Something went wrong:\n", e);
      this.setState(
        {
          isLoading: false,
        });
    })
      .finally(() => client.disconnect());

  };

  getIdentityInfo = () => {
    console.log("Called get identity info");

      const client = new Dash.Client({ 
        network: this.state.whichNetwork,
     });

      const retrieveIdentity = async () => {
        
        return client.platform.identities.get(this.state.identity); // Your identity ID
      };

      retrieveIdentity()
        .then((d) => {
          console.log("Identity retrieved:\n", d.toJSON());
          let idInfo = d.toJSON();
          this.setState(
            {
              identityInfo: idInfo,
              //TEST For Faster Name Submission
              identityRaw: d,
            },
            () => this.getNamesfromIdentities(this.state.identity)
          );
        })
        .catch((e) => {console.error("Something went wrong in retrieving the identity:\n", e);
        this.setState(
          {
            isLoading: false,
          }
        );
      })
        .finally(() => client.disconnect());
  };

  doTopUpIdentity = (numOfCredits) => {
    this.setState({
      isLoading:true,
      isLoadingButtons:true,
      
    });
    const clientOpts = {
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: this.state.mnemonic, // A Dash wallet mnemonic with testnet funds
        adapter: LocalForage.createInstance,
        unsafeOptions: {
          skipSynchronizationBeforeHeight: this.state.skipSynchronizationBeforeHeight,
        },
      },
    };
    const client = new Dash.Client(clientOpts);


    const topupIdentity = async () => {
      const identityId = this.state.identity; // Your identity ID
      const topUpAmount = numOfCredits; // Number of duffs ie 1000

      await client.platform.identities.topUp(identityId, topUpAmount);
      return client.platform.identities.get(identityId);
    };

    topupIdentity()
      .then((d) => {
        console.log("Identity credit balance: ", d.balance);
      this.setState({
        identityInfo: d.toJSON(),
        identityRaw: d,
        isLoading:false,
        isLoadingButtons:false,
        accountBalance: this.state.accountBalance - 1000000,
      });
    }
      )
      .catch((e) => {console.error("Something went wrong:\n", e);
      this.setState({
        isLoading:false,
        isLoadingButtons:false,
      });
    })
      .finally(() => client.disconnect());
  };

  handleNames = (nameToAdd) => {
    if(!this.state.nameList.includes(nameToAdd)){
    this.setState({
      nameList: [...this.state.nameList, nameToAdd],
    });
  }
  this.setState({ 
    isLoadingNames:false,
    isLoadingButtons:false,
  })
  };

  getNamesfromIdentities = (theIdentity) => {
    const client = new Dash.Client({network: this.state.whichNetwork,
      });

    const retrieveNameByRecord = async () => {
      return client.platform.names.resolveByRecord(
        "dashUniqueIdentityId",
        theIdentity 
      );
    };

    retrieveNameByRecord()
      .then((d) => {
      
      if(d.length === 0){
          console.log('There are no Names.');
          
        }else{
          let nameRetrieved = d[0].toJSON(); 
         console.log("Name retrieved:\n", nameRetrieved);
        this.handleNames(nameRetrieved.label);
        }
      
        this.getAliasfromIdentity(this.state.identity);
        
      })
      .catch((e) => {
        this.setState({
          isLoading:false,
        });
        console.error("Something went wrong:\n", e);
        console.log("There is no dashUniqueIdentityId to retrieve");
        this.getAliasfromIdentity(this.state.identity);
        
      })
      .finally(() => client.disconnect());
  };

  getAliasfromIdentity = (theIdentity) => {
    const client = new Dash.Client({network:this.state.whichNetwork,
      });

    const retrieveNameByRecord = async () => {
      // Retrieve by a name's identity ID
      return client.platform.names.resolveByRecord(
        "dashAliasIdentityId",
        theIdentity, // Your identity ID
      );
    };

    retrieveNameByRecord()
      .then((d) => {
        
        if(d.length === 0){
          console.log('There are no Aliases.')
          this.setState({
            isLoading: false,
            
          });
          
        }else{
          let aliasesRetrieved = d.map((alias) => {
          console.log("Alias: ", alias.toJSON().label);
          
          return alias.toJSON().label;
        });
        let filteredAliases = aliasesRetrieved.filter(alias=> !this.state.nameList.includes(alias));
        this.setState({
          isLoading: false, 
          nameList: [...this.state.nameList, ...filteredAliases],
        });
        }
        
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  render() {
    

    this.state.mode === "primary"
      ? (document.body.style.backgroundColor = "rgb(280,280,280)")
      : (document.body.style.backgroundColor = "rgb(20,20,20)");

    this.state.mode === "primary"
      ? (document.body.style.color = "black")
      : (document.body.style.color = "white");


    return (
      <>
        <TopNav
          accountBalance={this.state.accountBalance}
          identity={this.state.identity}
          handleMode={this.handleMode}
          mode={this.state.mode}
          showModal={this.showModal}
          whichNetwork={this.state.whichNetwork}
          isMnemonicAvail={this.state.isMnemonicAvail}
          expandedTopNav={this.state.expandedTopNav}
          handleExpandedNavs={this.handleExpandedNavs}
        />


        <Image fluid="true" id="dash-bkgd" src={DashBkgd} alt="Dash Logo" />

        {!this.state.isMnemonicAvail ? (
          <LandingPage
          showModal={this.showModal}
          mode={this.state.mode}
           />
        ) : (
          <>
          <ConnectedWalletPage
          handleSkipSyncLookBackFurther={this.handleSkipSyncLookBackFurther}
            showModal={this.showModal}
            isLoading={this.state.isLoading}
            isLoadingNames={this.state.isLoadingNames}
            identity={this.state.identity}
            identityInfo={this.state.identityInfo}
            nameList={this.state.nameList}
            accountBalance={this.state.accountBalance}
            mode={this.state.mode}
          />

          
        <BottomNav
        retrieveIdentitiesfromWallet={this.retrieveIdentitiesfromWallet}
          accountBalance={this.state.accountBalance}
          nameList={this.state.nameList}
          isLoading={this.state.isLoading}
          isLoadingButtons={this.state.isLoadingButtons}
          mode={this.state.mode}
          identity={this.state.identity}
          identityInfo={this.state.identityInfo}
          showModal={this.showModal}
          isMnemonicAvail={this.state.isMnemonicAvail}
          handleWalletDisconnect={this.handleWalletDisconnect}
          expandedBottomNav={this.state.expandedBottomNav}
          handleExpandedNavs={this.handleExpandedNavs}
        />
        </>
        )}

        <Footer />

        {this.state.isModalShowing &&
        this.state.presentModal === "ConnectToANetworkModal" ? (
          <ConnectToANetworkModal
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "CreateNewWalletModal" ? (
          <CreateNewWalletModal
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "SendFundsModal" ? (
          <SendFundsModal
            isModalShowing={this.state.isModalShowing}
            accountAddress={this.state.accountAddress}
            hideModal={this.hideModal}
            mode={this.state.mode}
            
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "ConnectWalletModal" ? (
          <ConnectWalletModal
          numberOfLocalForageKeys={this.state.numberOfLocalForageKeys}
            showModal={this.showModal}
            isModalShowing={this.state.isModalShowing}
            handleNEWWalletConnection={this.handleNEWWalletConnection}
            handleWalletConnection={this.handleWalletConnection}
            hideModal={this.hideModal}
            mode={this.state.mode}
            handleExpandedNavs={this.handleExpandedNavs}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "DisconnectWalletModal" ? (
          <DisconnectWalletModal
            isModalShowing={this.state.isModalShowing}
            handleWalletDisconnect={this.handleWalletDisconnect}
            hideModal={this.hideModal}
            mode={this.state.mode}
            handleExpandedNavs={this.handleExpandedNavs}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "RegisterIdentityModal" ? (
          <RegisterIdentityModal
            isModalShowing={this.state.isModalShowing}
            registerIdentity={this.registerIdentity}
            hideModal={this.hideModal}
            mode={this.state.mode}
            skipSynchronizationBeforeHeight={this.state.skipSynchronizationBeforeHeight}
            whichNetwork={this.state.whichNetwork}
            handleExpandedNavs={this.handleExpandedNavs}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "TopUpIdentityModal" ? (
          <TopUpIdentityModal
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            doTopUpIdentity={this.doTopUpIdentity}
            handleExpandedNavs={this.handleExpandedNavs}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "SearchForNameModal" ? (
          <SearchForNameModal

            showModal={this.showModal}
            whichNetwork={this.state.whichNetwork}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "RegisterNameModal" ? (
          <RegisterNameModal
          triggerButtonLoading={this.triggerButtonLoading}
          triggerNameLoading={this.triggerNameLoading}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            identity={this.state.identity}
            identityRaw={this.state.identityRaw}
            mnemonic={this.state.mnemonic}
            whichNetwork={this.state.whichNetwork}
            skipSynchronizationBeforeHeight={
              this.state.skipSynchronizationBeforeHeight
            }
            handleNames={this.handleNames}
            handleExpandedNavs={this.handleExpandedNavs}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "RegisterNameAliasModal" ? (
          <RegisterNameAliasModal
          triggerButtonLoading={this.triggerButtonLoading}
            triggerNameLoading={this.triggerNameLoading}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            identity={this.state.identity}
            identityRaw={this.state.identityRaw}
            mnemonic={this.state.mnemonic}
            whichNetwork={this.state.whichNetwork}
            skipSynchronizationBeforeHeight={
              this.state.skipSynchronizationBeforeHeight
            }
            handleNames={this.handleNames}
            handleExpandedNavs={this.handleExpandedNavs}
          />
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default App;
