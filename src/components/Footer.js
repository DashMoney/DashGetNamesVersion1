import React from "react";

class Footer extends React.Component {
  render() {
    return (
      <div id="bodytext" className="footer">
        {/* <h3>
          <Badge bg="primary">Resources</Badge>
        </h3> */}
        <h3>Resources</h3>
        <ul>
        <li>Check out<span></span>
            <a rel="noopener noreferrer" target="_blank" href="https://dashshoutout.com">
            <b>DashShoutOut.com</b>
            </a> once you have a name, and you can engage with the community!
          </li>
          <li>And try<span></span>
            <a rel="noopener noreferrer" target="_blank" href="https://dashgetmoney.com">
            <b>DashGetMoney.com</b>
            </a> to send and receive Dash just using your name!
          </li>
          <li>DashGetNames Github Repo - <a rel="noopener noreferrer" target="_blank" href="https://www.dashcentral.org/p/DashMoney-Dapp-Development-June-2023">
            <b>Pending Dash Treasury Proposal - LIVE</b>
            </a></li>
          <li>
            <a rel="noopener noreferrer" target="_blank" href="https://dashplatform.readme.io/">
              Dash Platform Developer Documentation
            </a>
          </li>
          <li><a rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=VoQxHhzWhT0">
          DashMoney - Closing Loops (Video)
            </a></li>
        </ul>
      </div>
    );
  }
}
export default Footer;
