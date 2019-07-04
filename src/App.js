import React, { Component } from 'react';
import loader from './images/loader.svg'
import clearButton from './images/close-icon.svg'
import Gif from './Gif'
import './App.css';

const randomChoise = arr => {
  const randomNumber = Math.floor(Math.random() * arr.length)
  return arr[randomNumber]
}

const Header = ({clearSearch, hasResults}) => (
  <header className="header grid">
    {hasResults ? <img src={clearButton} alt="X" onClick={clearSearch} className="clear-button"/> : <h1 className="title">Jiffy</h1>}
  </header>
)

const UserHint = ({loading, hintText}) => (
  <div className="user-hint">
    { loading ? 
    <img className="block mx-auto" src={loader} /> : 
    hintText 
  } </div>
)

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchTerm: '',
      hintText: '',
      gif: null,
      gifs: [],
      loading: false
    }
  }

  searchGiphy = async searchItem => {
    this.setState({
      loading: true
    })
    try {
      const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=F41rQtcID2Lmbn7PPP2wmBGYyR45PMcc&q=${searchItem}&limit=25&offset=0&rating=PG&lang=en`)
      const {data} = await response.json()

      if (!data.length) {
        throw `Nothing found for ${searchItem}`
      }

      const randomGif = randomChoise(data)
      console.log(randomGif)

      this.setState((prevState, props) => ({
        ...prevState,
        gif: randomGif,
        gifs: [...prevState.gifs, randomGif],
        loading: false,
        hintText: `Hit enter to search more ${searchItem}`
      }))

    } catch (error) {
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: error,
        loading: false
      }))
      console.log(error)
    }
  }

  //thanks to react app
  handleChange = event => {
    const { value } = event.target

    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: value,
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }))
    // console.log("change")
  }

  handleKeyPress = event => {
    const { value } = event.target
    // console.log("press")
    if (value.length > 2 && event.key === 'Enter') {
      this.searchGiphy(value)
    }
  }

  clearSearch = () => {
    this.setState(({prevState, props}) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: [] 
    }))
    this.textInput.focus()
  }

  render() {
    const { searchTerm, gifs } = this.state
    const hasResults = gifs.length
    console.log(hasResults)
    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults}/>
        <div className="search grid">
          { /*stack of gifs */}
          { gifs.map((gif, n) => <Gif {...gif} key = { n }/>) }

          <input 
            type="text" 
            className="input grid-item" 
            placeholder="Type something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={(input) => { this.textInput = input }}
          />
        </div>
        <UserHint {...this.state}/>
      </div>
    );
  }
}
