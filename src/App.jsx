import { useEffect, useState } from "react"
import { Card, PlayerTypes } from "./Card"

function App() {

  // boolean to show whether or not to show the same
  const [displayGame, setDisplayGame] = useState(false)
  // players list of cards
  const [playerCards, setPlayerCards] = useState([])
  // dealers list of cards
  const [dealerCards, setDealerCards] = useState([])
  // player sum of values from current cards
  const [playerSum, setPlayerSum] = useState(0)
  // dealer sum of values from current cards
  const [dealerSum, setDealerSum] = useState(0)
  // boolean to show dealers card (after player has finished their turn/busts)
  const [displayDealerSum, setDisplayDealerSum] = useState(false)

  useEffect(() => {
    (async () => {
      // request a deck
      const deckResponse = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
      // deck information
      const deckInfo = await deckResponse.json()

      const newPlayerCards = []
      const newDealerCards = []

      for(let i = 0; i < 2; i++) {
        // response to draw from a deck for player
        const playerCardResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deckInfo['deck_id']}/draw/?count=1`)
        // card information
        const playerCard = await playerCardResponse.json()
        // create a Card object from the response
        const playerCardObject = new Card(
          playerCard['cards'][0]['suit'],
          playerCard['cards'][0]['value'], 
          playerCard['cards'][0]['image'], 
          true
        )
        // add Card object to list of players cards
        newPlayerCards.push(playerCardObject)

        // response to draw from a deck for dealer
        const dealerCardResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deckInfo['deck_id']}/draw/?count=1`)
        // card information
        const dealerCard = await dealerCardResponse.json()
        // create a Card oject from the response
        const dealerCardObject = new Card(
          dealerCard['cards'][0]['suit'],
          dealerCard['cards'][0]['value'], 
          dealerCard['cards'][0]['image'], 
          // false be default, don't show the dealers cards
        )
        // add Card object to list of dealers cards
        newDealerCards.push(dealerCardObject)
      }

      setPlayerCards(newPlayerCards)
      setDealerCards(newDealerCards)

      // calculate sum of all cards of players cards
      determineSum(newPlayerCards, PlayerTypes.Player)
      // calculate sum of all cards of dealers cards
      determineSum(newDealerCards, PlayerTypes.Dealer)
    })()
  }, [])

  // logic to handle hitting
  const hit = async () => {

  }

  // logic to handle standing
  const stand = async () => {

  }

  // logic to determine sum of all cards in a deck
  const determineSum = (cards, playerType) => {
    // accumulated sum
    let sum = 0;
    // accumulates aces considered
    let aces = 0;

    // for each card in deck
    cards.forEach(card => {
      // if is an array (Ace [either a 1 or 11])
      if(Array.isArray(card.value)) {
        // add 11 to sum by default
        sum += 11
        // increment aces count
        aces += 1
      // is a regular valued card 
      } else {
        // increment sum of card
        sum += card.value
      }
    })

    // while the sum is more than 21 (since 11 is incremented) and there is more than 1 ace
    while(sum > 21 && aces > 0) {
      // adjust value based on ace
      sum -= 10
      // decrease value of aces considered
      aces -= 1
    }

    // if player considered is the player
    if(playerType === PlayerTypes.Player) {
      // if there is an ace in current cards
      if(aces > 0) {
        // if sum of cards is 21
        if(sum === 21) {
          // player has blackjack!
          setPlayerSum(21)
          return
        } 
        // show sum as 2 possible values (sum + ace as 11 or sum + ace as 1)
        setPlayerSum(`${sum - 10 * aces}/${sum}`)
        return
      }
      // set sum as regular
      setPlayerSum(sum)
      return

      // if player considered is the dealer
    } else if(playerType === PlayerTypes.Dealer) {
        // if there is an ace in current cards
        if(aces > 0) {
          // if sum of cards is 21
          if(sum === 21) {
            // dealer has blackjack!
            setDealerSum(21)
            return
          }
          // show sum as 2 possible values (sum + ace as 11 or sum + ace as 1)
          setDealerSum(`${sum - 10 * aces}/${sum}`)
          return
        }
        // set sum as regular
        setDealerSum(sum)
        return

    }
  }

  return (
    <>
      <h1>Blackjack</h1>
      {displayGame ?
        <>
          {/* dealers cards */}
          <div id="player-cards">
            {dealerCards.map((card, i) => {
              return (
                <img 
                  className="card" 
                  key={i} src={card.cardImage} 
                  alt={`${card['value']} of ${card['suit']}`} 
                />
              );
            })}
          </div>

          {displayDealerSum &&
            <p>Dealer has {dealerSum}</p>
          }

          {/* players cards */}
          <div id="dealer-cards">
            {playerCards.map((card, i) => {
              return (
                <img 
                  className="card" 
                  key={i} src={card.cardImage} 
                  alt={`${card['value']} of ${card['suit']}`} 
                />
              );
            })}
          </div>

          <p>Player has {playerSum}</p>

          <button onClick={hit}>Hit</button>
          <button onClick={stand}>Stand</button>

        </>
      :
        <button
            onClick={() => setDisplayGame(true)}
        >
          Play Blackjack!
        </button>
      }
      
    </>
  )
}

export default App
