import './App.css';
import greenSprite from "./sprites/greenSprite.svg"
import neutralSprite from "./sprites/neutralSprite.png"
import redSprite from './sprites/redSprite.png'
import React from 'react'
class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      dimensions:{
        width:0,
        height:0
      },
      grid: Array(),
      player: 0,
      moves: 0,
      enemiesPos: [],
      gameOver:false
    }

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.checkEnemies = this.checkEnemies.bind(this);
  }

  componentDidMount(){
    let width  = parseInt(prompt("Please enter width", "10"));
    if (width == null || width == "") {
      window.alert("User cancelled the prompt.");
    }else{
      let height = parseInt(prompt("Please enter height", "10"));
      if (height == null || height == "") {
        window.alert("User cancelled the prompt.");
      }

      const newGrid = Array(width*height).fill(0);
      const playerPos = Math.floor((height/2)*width +width/2)-1;
      newGrid[playerPos] = 1;
      
      let greenCount = 0
      let enemiesPosNew = [...this.state.enemiesPos]
      while (greenCount !=width){
        let newPos  = Math.floor(Math.random()*newGrid.length);
        if(newPos !==playerPos){
          newGrid[newPos] = -1;
          enemiesPosNew.push(newPos);
          greenCount+=1;
        }
      }

      this.setState({
        dimensions:{
          width,
          height
        },
        grid: newGrid,
        player: playerPos,
        enemiesPos:enemiesPosNew
      })
      
    } 
    
    window.addEventListener("keypress",this.handleKeyPress)
  }

  componentWillUnmount(){
    window.removeEventListener("keypress",this.handleKeyPress)
  }

  handleKeyPress(e) {
    const newGrid = [...this.state.grid];
    let playerPos = this.state.player;
    let moves = this.state.moves;
    switch(e.key){
      case "a":
        playerPos = (this.state.player)>0? (this.state.player-1):this.state.player;
        newGrid[this.state.player] = 0;
        newGrid[playerPos] = 1;
        moves = playerPos==this.state.player?moves: moves+=1;
        break;
      case "d":
        playerPos = (this.state.player)<(this.state.grid.length)? (this.state.player+1):this.state.player;
        newGrid[this.state.player] = 0;
        newGrid[playerPos] = 1;
        moves = playerPos==this.state.player?moves: moves+=1;
        break;
      case "w":
        playerPos = (this.state.player)>=(this.state.dimensions.width)? (this.state.player-this.state.dimensions.width):this.state.player;
        newGrid[this.state.player] = 0;
        newGrid[playerPos] = 1;
        moves = playerPos==this.state.player?moves: moves+=1;

        break;
      case "s":
        playerPos = (this.state.player)<(this.state.grid.length-this.state.dimensions.width)? (this.state.player+this.state.dimensions.width):this.state.player;
        newGrid[this.state.player] = 0;
        newGrid[playerPos] = 1;
        moves = playerPos==this.state.player?moves: moves+=1;
        break;
    }
    const {enemiesPosNew,gameOver} = this.checkEnemies(playerPos)
    this.setState({
      grid: newGrid,
      player: playerPos,
      moves,
      enemiesPos:enemiesPosNew,
      gameOver:gameOver
    })
    if(gameOver){
      alert(`Congratulations! Game Over, Total moves to save the princess ${this.state.moves}`)
    }
  }

  checkEnemies(playerPos){
    const enemiesPosNew = this.state.enemiesPos.filter((enemy)=>{
      return enemy!=playerPos
    });
    const gameOver = enemiesPosNew.length>0? false:true
    return {enemiesPosNew,gameOver}
  }
  
 render(){
   
  return(
    <div className={"App"}>
      <h1>The Maze Problem</h1>
      <GridDisplay grid={this.state.grid} moves={this.state.moves} enemiesLeft={this.state.enemiesPos.length} width={this.state.dimensions.width} height={this.state.dimensions.height} gameOver ={this.state.gameOver}/>
    </div>
  );}
}

function GridDisplay(props){
  const cellList = props.grid.map((cell,index)=>{
    let src= neutralSprite; 
    if(cell ===1){
      src=redSprite
    }else if(cell == -1){
      src = greenSprite
    }

    
    return (
      <span key={index}>
      <img  src={src} /> 
      {(index+1)%props.width==0? <br />:null}
      </span>)

  })
  
  return(
    <div className={"gridDisplay"}>
    {props.gameOver ? <StatsScore moves= {props.moves}/>:cellList}
    {props.gameOver? null : <p>Use WASD to move.</p>}
    <p>Moves: {props.moves}</p>
    <p>Enemies left: {props.enemiesLeft}</p>
    </div>
  )
}


function StatsScore(props) {
  return (
    <div>
      <p>You Won in {props.moves} moves!</p>
    </div>
  )
}

export default App;
