import React from "react";
//import Container from 'react-bootstrap/Container';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import WalletButton from "./WalletButton";
import RegisterIdentButton from "./RegisterIdentButton";
import TopUpButton from "./TopUpButton";
import NameButton from "./NameButton";

import "./BottomNav.css";


class BottomNav extends React.Component {

  render() {

    return (
      <>
        <Navbar 
        //expanded={this.props.expandedBottomNav}
        className="bottomNav"  bg={this.props.mode}
         variant={this.props.mode} fixed="bottom">

          {/* <Container>
        <Navbar.Toggle onClick={()=>this.props.handleExpandedNavs("BottomNav")}
         aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav"> */}
          
          {/* <Nav fill defaultActiveKey="/home" className="me-auto"> */}
          <Nav  className="one-level-nav">

            <WalletButton 
              retrieveIdentitiesfromWallet={this.props.retrieveIdentitiesfromWallet}
              accountBalance={this.props.accountBalance}
              mode={this.props.mode}
              isMnemonicAvail ={this.props.isMnemonicAvail}
              handleWalletDisconnect= {this.props.handleWalletDisconnect}
             showModal={this.props.showModal}
            />

{this.props.identity === ''?
            <RegisterIdentButton 
              accountBalance={this.props.accountBalance}
              isLoading={this.props.isLoading}
              identityInfo = {this.props.identityInfo}
              identity = {this.props.identity}
              mode={this.props.mode}
              isMnemonicAvail ={this.props.isMnemonicAvail}
              showModal={this.props.showModal}
            />
:
            <TopUpButton
              isLoadingButtons = {this.props.isLoadingButtons}
              identityInfo = {this.props.identityInfo}
              mode={this.props.mode}
              isMnemonicAvail ={this.props.isMnemonicAvail}
              showModal={this.props.showModal}
            />
      }
            <NameButton
              isLoadingButtons = {this.props.isLoadingButtons}
              nameList={this.props.nameList}
              mode={this.props.mode}
              identityInfo = {this.props.identityInfo}
              isMnemonicAvail ={this.props.isMnemonicAvail}
              showModal={this.props.showModal}
            />

         
          </Nav>
          {/* </Navbar.Collapse>
          </Container> */}
        </Navbar>
      </>
    );
  }
}
export default BottomNav;
