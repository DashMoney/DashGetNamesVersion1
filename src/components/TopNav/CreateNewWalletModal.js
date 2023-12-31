
import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import CloseButton from 'react-bootstrap/CloseButton';
import "./CreateNewWalletModal.css";

const Dash = require('dash');
const clientOpts = {
  network: 'testnet',
  wallet: {
    mnemonic: null, // this indicates that we want a new wallet to be generated
    // if you want to get a new address for an existing wallet
    // replace 'null' with an existing wallet mnemonic
    offlineMode: true,  // this indicates we don't want to sync the chain
    // it can only be used when the mnemonic is set to 'null'
  },
};

const client = new Dash.Client(clientOpts);

class CreateNewWalletModal extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isLoading:true, 
      response:{},
      copiedMnemonic: false,
      copiedAddress: false
    }
  }

createWallet = async () => {
    const account = await client.getWalletAccount();
  
    const dashmnemonic = client.wallet.exportWallet();
    const dashaddress = account.getUnusedAddress();
    this.setState({
      response:{mnemonic: dashmnemonic,
      unusedAddress: dashaddress.address
      }

    })
    // console.log('Mnemonic:', dashmnemonic);
    // console.log('Unused Address:', dashaddress.address);
  };

  handleCloseClick=()=>{ 
    this.props.hideModal();
  }

  componentDidMount() {
   this.createWallet();
  }

  render(){
    let modalBkg = "";
    let closeButtonColor;
    
    if(this.props.mode === "primary"){
      modalBkg = "modal-backcolor-primary";
      closeButtonColor = <CloseButton onClick={this.handleCloseClick}/>
    }else{
      modalBkg = "modal-backcolor-dark";
      closeButtonColor = <CloseButton onClick={this.handleCloseClick} variant="white"/>
    }

    return(

      <>
        <Modal show={this.props.isModalShowing}
      contentClassName={modalBkg} >

        <Modal.Header>
          <Modal.Title>Create New Wallet</Modal.Title>
          {closeButtonColor}
        </Modal.Header>

        <Modal.Body>
        
          <h5>Important:</h5>
          <p><b>You will need to save the Mnemonic!</b> </p>
          <Alert variant="primary">
          <Alert.Heading>Mnemonic:</Alert.Heading>
          <p>
          {this.state.response.mnemonic}
          </p>
          <Button variant="outline-primary" 
          onClick={()=>{
            navigator.clipboard.writeText(this.state.response.mnemonic);
            this.setState({
              copiedMnemonic:true
            });
          }}
          >Copy</Button>
          {this.state.copiedMnemonic?<span>Copied!</span>:<></>}
        </Alert>

        <Alert variant="primary">
          <Alert.Heading>Wallet Address:</Alert.Heading>
          <p>
          {this.state.response.unusedAddress}
          </p>
          <Button variant="outline-primary" 
          onClick={()=>{
            navigator.clipboard.writeText(this.state.response.unusedAddress);
            this.setState({
              copiedAddress:true
            });
          }}
          >Copy</Button>
          {this.state.copiedAddress?<span>Copied!</span>:<></>}
        </Alert>
        
          <p>Use your <b>Wallet Address</b> and one of the Faucets below to send tDash (Testnet Dash) to your Wallet.</p>
        
        <h5>Dash Testnet Faucets:</h5>
        <ul>

        <li><b><a rel="noopener noreferrer" target="_blank" href = "https://testnet-faucet.dash.org/">testnet-faucet.dash.org/</a></b></li>
        <p></p>
          
        <li><a rel="noopener noreferrer" target="_blank" href = "http://faucet.test.dash.crowdnode.io/"><b>faucet.test.dash.crowdnode.io/</b></a></li>

          

        </ul>
        

        {/* <h5>Testnet Block Explorer:</h5>
        <ul>
          <li><a rel="noopener noreferrer" target="_blank" href = "https://testnet-insight.dashevo.org/insight/">https://testnet-insight.dashevo.org/insight/</a></li>
          
        </ul>
        <p>Enter your "unused address" (now used address) in the Block Explorer to check that you have received tDash.</p> */}

        {/* Using the faucet at https://testnet-faucet.dash.org/,   There is a block explorer running at https://testnet-insight.dashevo.org/insight/ which can be used to check confirmations. */}
    

        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={this.handleCloseClick}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </>  
    );
  }
}

export default CreateNewWalletModal;
