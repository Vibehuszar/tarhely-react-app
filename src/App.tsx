import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

interface State{
  tarhelyek: Tarhely[] 
  nevInput: string;
  meretInput: number;
  arInput: number;
}

interface Tarhely{
  id: number;
  nev: string;
  meret: number;
  ar: number;
}

interface TarhelyListResponse{
  tarhelyek: Tarhely[];
}

class App extends Component<{}, State>{

  constructor(props: {}){
    super(props);

    this.state = {
      nevInput: '',
      meretInput: 0,
      arInput: 0,
      tarhelyek: [],
    }
  }

  async loadTarhelyek() {
    let response = await fetch('http://localhost:3000/api/tarhely');
    let data = await response.json() as TarhelyListResponse;
    this.setState({
      tarhelyek: data.tarhelyek, 
    })
  }

  componentDidMount() {
    this.loadTarhelyek();
  }

  handleUpload = async () => {
    const { nevInput, meretInput, arInput } = this.state;
    if(nevInput.trim() === '' || meretInput<1 || arInput <1){
      // this.setState()- tel hibaüzenet megjelenítése
      return;
    }

    const adat = {
      nev: nevInput,
      meret: meretInput,
      ar: arInput,
    }

    let response = await fetch('http://localhost:3000/api/tarhely', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adat),
    });

    this.setState({ 
      nevInput: '',
      meretInput: 0,
      arInput: 0,
    })

    await this.loadTarhelyek();
  };

  render() {
    const { nevInput, meretInput, arInput } = this.state;
    return <div>
    <h2>Új tárhely</h2>
    Név: <input type="text" value={nevInput} onChange={e => this.setState({ nevInput: e.currentTarget.value})} /> <br />
    Méret: <input type="number" value={meretInput} onChange={e => this.setState({ meretInput: parseInt(e.currentTarget.value) })}/> <br />
    Ár: <input type="number" value={arInput} onChange={e => this.setState({ arInput: parseInt(e.currentTarget.value) })} /> <br />
    <button onClick={this.handleUpload}>Regisztráció</button> <br />
    <h2>Tárhelyek:</h2>
    <ul>{
          this.state.tarhelyek.map(tarhely => 
          <li>{tarhely.nev}</li>
          )
        }</ul>
    </div>
  }
}

export default App;
