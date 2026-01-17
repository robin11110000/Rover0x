## Wave 5 Judge Reviews Summary

I've extracted all the judge comments from Wave 5 submissions on the AKINDO page. Here's a detailed summary of the feedback:

### **LineraFlow**
**Judge: twey_linera** (10 points)
- Praised the beautiful UI concept and solid technical execution
- Loved the Linera integration

**Previous Wave (dannygre ene)**: Congratulated on building the instant donation system, but Wave 3 was categorized as Yellow due to not connecting to Testnet Conway

***

### **Alethea Network** 
**Judge: eldios** (9 points)
- Impressed by commit-reveal voting to prevent front-running, showing deep oracle security understanding
- Appreciated deployment to Conway testnet
- Noted the 4-tier reputation and slashing mechanics demonstrate understanding of economic incentives
- Wants to see this evolve into production oracle for Linera ecosystem

**Previous judges noted**: Earlier waves had issues with incomplete Linera SDK usage and frontend-testnet interaction

***

### **CoinDrafts**
**Judge: eldios** (9 points)
- Really interesting fantasy sports for crypto concept with real market potential
- **Standout feature**: DevOps setup with single `docker compose up`, health checks, and pre-seeded data - made it trivial for judges to test
- Four-contract architecture and multiple tournament formats show thinking beyond MVP
- Encouraged to keep iterating

**Previous Wave (dannygreene)**: Categorized as Yellow - didn't appear to connect to Testnet Conway on inspection

***

### **PulseBet**
**Judge: deuszx** (9 points)
- Very polished product, lots of fun playing the games
- Suggested familiarizing with new auto-signing capabilities of the client to make experience smoother (no manual signing needed)
- Interested in seeing more mini games

***

### **Blackjack on Microchains**
**Judge: eldios** (9 points)
- **Architecture highlight**: Multi-chain design is exactly what judges wanted to see - clearly understands Linera's microchain model
- Four distinct chain types (Master, Public, Play, User) with specific responsibilities shows thoughtful design
- **Major advantage**: Live demo at [blackjack.gmic.app](https://blackjack.gmic.app) removes all friction for testing
- Flutter choice shows cross-platform thinking
- "This is the kind of architecture that scales"

**Previous Wave (twey_linera - 4th Wave)**: Consistently strong, lobby functionality significant, wanted to see Linera Web client integration

***

### **microcard**
**Judge: eldios** (9 points)  
- Same feedback as Blackjack on Microchains (appears to be duplicate or related project)
- Four distinct chain types architecture praised
- Live demo removes friction

***

### **DeadKeys**
**Judge: twey_linera** (8 points)
- Loves the fun game with lots of effects
- Very responsive
- Enjoys the multiplayer mode as well

**Previous Wave (eldios - 4th Wave)**: 
- **Critical bug**: Scored 105K points, earned 10K gold, and it all vanished - persistence is broken
- Leaderboard doesn't save data in live demo
- Game is fun but full user flow needs testing before submission
- "I want my 105K points on the leaderboard! :D"

***

### **LinCasino**
**Judge: eldios** (8 points)
- Lot of effort evident in poker implementation - proper hand evaluation, betting rounds, blinds
- **Particularly liked**: Shared ABI crate for card game primitives shows good software engineering
- Multiplayer lobby with cross-chain coordination is well architected
- **Suggestion**: Add docker-compose setup for easier onboarding
- Clear ambition, encouraged to keep pushing forward

**Previous Wave (dannygreene)**: Categorized as Red - didn't appear to connect to Testnet Conway

***

### **Linera AgentHub**
**Judge: eldios** (8 points)
- No detailed comment visible, but received 8/10 scoring

***

### **Linera Name System**
**Judge: twey_linera** (6 points)
- Great idea (judge pays for .eth domains)
- **Major issue**: Execution didn't work well
- Neat hack around lack of multichain support using request proxying, but server doesn't expose required `/linera/api` path
- Many requests just don't work
- Good idea and execution looks solid once fixed

***

### **LABYRINTH LEGENDS**
**Judge: twey_linera** (6 points)
- Very shiny! Reminds judge of Enigma/Oxyd games
- **Wants more**: Would love to see more Linera integration beyond just saving scores
- Assumes tournament mode will provide multiplayer interactivity

***

### **TrueMarket Linera**
**Judge: deuszx** (6 points)
- Addresses hot topic of prediction markets
- **Multiple issues found**:
  - Never saw open positions (not in profile, not at bottom)
  - When opened/sold positions, info didn't appear anywhere
  - Price chart never moves/updates
- Acknowledged prediction market apps are difficult to build

***

## Key Themes from Judge Feedback

### **What Judges Love:**
1. **Live demos** that work - removes friction (Blackjack on Microchains praised heavily for this)
2. **Easy onboarding** - docker-compose setups, pre-seeded data (CoinDrafts)
3. **Proper Linera architecture** - multi-chain designs with clear separation of concerns
4. **Cross-chain messaging** - proper implementation of Linera's unique features
5. **Thoughtful economic design** - reputation systems, slashing mechanics (Alethea)
6. **Auto-signing integration** - using new Linera client capabilities

### **Common Issues:**
1. **Persistence problems** - data not saving across sessions (DeadKeys)
2. **Conway testnet connectivity** - many projects didn't properly connect
3. **Incomplete features** - placeholders and "coming soon" sections
4. **Missing SDK integration** - not using proper Linera Views and patterns
5. **UI state management** - positions/data not appearing in interfaces

### **Judge Expectations:**
- Test full user flow before submission
- Deploy to Conway testnet (not just local)
- Use proper Linera SDK patterns (Views, cross-chain messages)
- Implement persistence correctly
- Make demos easily accessible

The judging criteria were: Working Demo & Functionality, Linera Tech Stack Integration, Creativity & User Experience, Real Use Case & Scalability, and Vision & Roadmap - each scored out of 10 points.