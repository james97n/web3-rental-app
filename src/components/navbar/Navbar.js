import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../images/logo/logo.png";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";
import { ethers } from 'ethers';
import { useState } from 'react';

function NavBar() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);

  async function connectWallet() {
    if (!window.ethereum) {
      alert('MetaMask not detected. Install it first.');
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const account = accounts[0];
      setWalletAddress(accounts);

      const balanceWei = await provider.getBalance(account);
      const balanceEth = ethers.formatEther(balanceWei);
      setBalance(parseFloat(balanceEth).toFixed(4)); // Keep it clean (e.g., 0.1234 ETH)
    } catch (error) {
      console.log(error);
      if (
        error.code === 'ACTION_REJECTED' ||
        error?.info?.error?.code === 4001
      ) {
        alert('User cancelled the connection request.');
      } else {
        alert('Failed to connect wallet. Please try again.');
      }
    }
  }

  function disconnectWallet() {
    setWalletAddress(null);
    setBalance(null);
    console.log('Wallet disconnected');
  }

  return (
    <>
      {walletAddress && (
        <p className="text-end flex justify-content-end align-items-center mb-0 py-2 px-3">
          Connected: <span>{walletAddress}</span>
          {balance && (
            <span className="ms-3 text-muted">Balance: {balance} ETH</span>
          )}
        </p>
      )}
      <Navbar expand="lg" className="py-3">
        <Container>
          <Navbar.Brand href="#" className="me-lg-5">
            <img className="logo" src={logo} alt="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" navbarScroll>
              <Nav.Link href="#action1">Marketplace</Nav.Link>
              <Nav.Link href="#action2" className="px-lg-3">
                About Us
              </Nav.Link>
              <Nav.Link href="#action3">Developers</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <div className="d-flex align-items-center order">
            <span className="line d-lg-inline-block d-none"></span>
            <i className="fa-regular fa-heart"></i>
            <>
              {walletAddress ? (
                <Button
                  onClick={disconnectWallet}
                  variant="secondary"
                  className="btn-primary d-none d-lg-inline-block"
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  onClick={connectWallet}
                  variant="primary"
                  className="btn-primary d-none d-lg-inline-block"
                >
                  Connect Wallet
                </Button>
              )}
            </>
          </div>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
