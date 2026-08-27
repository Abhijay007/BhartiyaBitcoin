# Bitcoin Bharat — 60-Day Curriculum

Source: bhartiyabitcoin.com
Languages: Hindi, Bengali, Tamil, Telugu, Kannada, Malayalam, Gujarati, Punjabi, Marathi, Assamese, Odia, Urdu, Kashmiri, Sindhi

---

## Days 1–15: Bitcoin Basics

**Day 01 — What is Bitcoin?**
Bitcoin is a decentralized digital currency. No bank, no government, no company controls it. It runs on a global network of computers (nodes) following the same rules. Anyone can send bitcoin to anyone else, anywhere in the world, without asking permission.

**Day 02 — Who created Bitcoin? (Satoshi Nakamoto)**
Bitcoin was created by a person or group using the name "Satoshi Nakamoto." Nobody knows who Satoshi really is. In 2008 Satoshi published the Bitcoin whitepaper. In 2009 the first block (genesis block) was mined. Then Satoshi disappeared.

**Day 03 — The Bitcoin Whitepaper**
The whitepaper is titled "Bitcoin: A Peer-to-Peer Electronic Cash System." Published October 31, 2008. It describes how to send money digitally without a trusted third party (like a bank). 9 pages that changed money forever.

**Day 04 — Why was Bitcoin created?**
Bitcoin was born from the 2008 financial crisis. Banks gambled with people's money, governments bailed them out, and ordinary people suffered. Bitcoin's answer: a system where you don't need to trust banks or governments. The genesis block contains a hidden message: "Chancellor on brink of second bailout for banks."

**Day 05 — Why did Satoshi disappear?**
Satoshi handed over the code and disappeared around 2010. Possible reasons: (1) to make Bitcoin truly decentralized — no leader to attack or corrupt, (2) personal safety — governments could target them, (3) the project could stand on its own. The disappearance was a gift to Bitcoin's neutrality.

**Day 06 — Bitcoin vs bitcoin vs BTC: What's the difference?**
- Bitcoin (capital B) = the network and protocol
- bitcoin (lowercase b) = the currency unit
- BTC = the ticker symbol used on exchanges
- 1 BTC = 100,000,000 satoshis (sats)
You don't need to buy a whole Bitcoin. You can buy ₹100 worth.

**Day 07 — What are Sats (Satoshis)?**
1 Bitcoin = 100 million satoshis (sats). Named after Satoshi Nakamoto. Sats are like paisa to the rupee — just much smaller. Current price: even small amounts of sats hold real value. You don't need to own a whole Bitcoin to participate.

**Day 08 — Why is your money in someone else's hands?**
When you put money in a bank, the bank lends it out. Your money isn't really "there." Banks can freeze accounts, restrict withdrawals, or fail. Bitcoin solves this: when you hold your own keys, no third party can touch your bitcoin.

**Day 09 — When trust breaks down, then what?**
Banks, governments, and institutions have failed people throughout history — demonetization, bank runs, hyperinflation, account freezes. Bitcoin is designed to work without trusting anyone. The protocol enforces the rules, not humans.

**Day 10 — Bitcoin: The trustless system**
"Trustless" doesn't mean untrustworthy. It means you don't NEED to trust any individual or institution. The math and code enforce the rules. Every transaction is verified by thousands of independent computers worldwide. No one person can cheat the system.

---

## Days 11–15: Nodes, Mining & Blockchain

**Day 11 — Bitcoin Nodes: The real referees**
A node is a computer running Bitcoin software and storing the full blockchain. Nodes enforce the rules. If a miner breaks the rules, nodes reject the block. There are ~20,000+ public nodes worldwide. Anyone can run one on a cheap computer (Raspberry Pi works). Nodes are the true power in Bitcoin — not miners, not developers.

**Day 12 — Bitcoin Miners and Proof of Work**
Miners compete to add new blocks to the blockchain. They do this by solving a mathematical puzzle (hashing) that requires enormous computational work. The winner gets the block reward (currently 3.125 BTC) + transaction fees. This work is called "Proof of Work" — proof that real energy was spent.

**Day 13 — The Byzantine Generals Problem — solved**
Imagine generals surrounding a city who must coordinate an attack but can't trust their messengers. Bitcoin solved this 1,000-year-old problem: how do strangers agree without trusting each other? Answer: Proof of Work. Cheating costs more energy than it gains. Honesty is profitable; dishonesty is not.

**Day 14 — What is the Bitcoin Blockchain?**
The blockchain is a public ledger of every Bitcoin transaction ever made. It's a chain of blocks, each containing transactions, linked together cryptographically. Once recorded, transactions cannot be changed. Anyone can view the entire history at mempool.space or blockchain.com.

**Day 15 — What is Hashing? How does the blockchain work?**
A hash is a unique fingerprint of data. Change one character in the input → completely different hash output. Bitcoin uses SHA-256 hashing. Each block contains the hash of the previous block — creating the "chain." This is why altering history is practically impossible: you'd have to redo all the work for every subsequent block.

---

## Days 16–21: Security, Mining Deep Dive

**Day 16 — Why is the blockchain so secure?**
To change a transaction, an attacker would need to: (1) redo the proof of work for that block, (2) redo it for every block after it, (3) do this faster than the honest network adds new blocks. This requires controlling 51%+ of all mining power — currently worth billions of dollars.

**Day 17 — Who adds transactions to the blockchain?**
Miners. When you send bitcoin, your transaction goes to the "mempool" (waiting room). Miners pick transactions from the mempool, bundle them into a block, and race to solve the proof-of-work puzzle. The winner adds the block and earns the reward.

**Day 18 — Why do miners compete, and how do they win?**
Miners compete because the block reward is valuable. They win by finding a hash output below a target number — pure trial and error, trillions of attempts per second. It's like a lottery where buying more tickets (more hashing power) increases your odds but guarantees nothing.

**Day 19 — Why is Bitcoin censorship-resistant?**
No single person or entity controls which transactions get included. Thousands of independent miners worldwide compete. Even if one government shuts down miners in their country, miners elsewhere continue. Bitcoin has never had a transaction successfully censored at the protocol level.

**Day 20 — What role does energy play in Bitcoin mining?**
Energy is the cost that makes Bitcoin secure. The energy spent on mining is what makes cheating expensive. Without energy cost, anyone could rewrite history cheaply. Energy = security. More energy = harder to attack.

**Day 21 — Fun fact: How much work goes into Bitcoin mining?**
The Bitcoin network performs ~600 exahashes per second. That's 600,000,000,000,000,000,000 hash attempts per second. Every 10 minutes, one miner wins. The difficulty adjusts every 2 weeks to keep block time at ~10 minutes regardless of how many miners join.

---

## Days 22–30: Nodes, Supply & Governance

**Day 22 — What are Bitcoin nodes?**
Full nodes download and verify every transaction and block since 2009. Light nodes (SPV) trust full nodes for verification. Running a full node: protects your own privacy, contributes to network security, ensures you personally verify the rules are followed. Cost: ~$100–200 hardware, ~500GB storage.

**Day 23 — Miners vs Nodes + Why run a node?**
Miners produce blocks. Nodes decide if those blocks are valid. A miner who breaks rules gets their block rejected by nodes and loses their reward. Nodes are the constitution; miners are workers who must follow it. Running a node = voting with your computer for the rules you believe in.

**Day 24 — Why only 21 million Bitcoin?**
Satoshi chose 21 million as the hard cap. This is enforced in the code, and every node enforces it. No one can create more — not Satoshi (if alive), not governments, not developers. The 21 million limit makes Bitcoin the first truly scarce digital asset.

**Day 25 — What happens after 2140?**
The last Bitcoin will be mined around 2140. After that, miners earn only transaction fees. Bitcoin is designed so that as the block reward decreases (halving), increased adoption should mean higher transaction fees sustain miner revenue. This has worked through 3 halvings so far.

**Day 26 — Can miners speed up the supply?**
No. The difficulty adjustment makes this impossible. If miners add more power trying to mine faster, difficulty increases to keep block time at 10 minutes. The supply schedule is mathematically enforced. No one can inflate Bitcoin.

**Day 27 — Bitcoin vs Gold: The real difference**
Gold: finite but unknown total supply, hard to verify purity, heavy to transport, divisible but not easily. Bitcoin: provably finite (21M), instantly verifiable, instantly transportable, divisible to 8 decimal places. Bitcoin is often called "digital gold" but with key improvements for the digital age.

**Day 28 — Who is Bitcoin's CEO? How are decisions made?**
Bitcoin has no CEO, no company, no headquarters. Decisions happen through rough consensus: developers propose changes (BIPs - Bitcoin Improvement Proposals), miners signal support, nodes vote by upgrading (or not). Nobody can force a change. Everyone must agree, or the change doesn't happen.

**Day 29 — Soft Fork vs Hard Fork: How does Bitcoin upgrade?**
Soft fork: backwards-compatible upgrade. Old nodes still work. (Example: SegWit). Hard fork: incompatible change that splits the network. Bitcoin has never had a successful hostile hard fork. Failed attempts: Bitcoin Cash, Bitcoin SV — all became separate, smaller chains.

**Day 30 — Who decides Bitcoin's future?**
Everyone and no one. Developers write code. Miners run it (or don't). Node operators enforce rules. Users choose which chain to use. This distributed power is Bitcoin's strength — no single point of capture or control. Governments cannot "fix" Bitcoin by pressuring one group.

---

## Days 31–45: Transactions, Custody & Lightning

**Day 31 — Can Bitcoin be spent twice?**
The double-spend problem: can I send the same bitcoin to two people? Bitcoin solves this through the blockchain. Once a transaction is confirmed, it's permanently recorded. Nodes reject any attempt to spend the same UTXO twice. 6 confirmations (~1 hour) = essentially irreversible.

**Day 32 — Token vs Ledger: Bank system vs Bitcoin**
Banks use a token model: they create new money by issuing loans. Bitcoin uses a ledger model: only existing UTXOs can be spent. No bank can lend out your bitcoin without your private key. Your bitcoin is yours — not a bank's liability.

**Day 33 — Bitcoin's public ledger**
Every transaction is public and permanent on the blockchain. You can see the amount, sender address, receiver address, and timestamp. You cannot see who owns an address (unless they reveal it). Privacy comes from not linking your identity to your address.

**Day 34 — How Bitcoin tracks balances: UTXO system**
Bitcoin doesn't have "accounts" with balances. It has UTXOs (Unspent Transaction Outputs) — like individual coins/bills. When you receive 0.5 BTC, you have a UTXO worth 0.5 BTC. When you spend it, that UTXO is destroyed and new ones are created. Your "balance" = sum of all your UTXOs.

**Day 35 — "Not your keys, not your coins"**
Your private key is the only proof of ownership. Exchanges hold keys on your behalf. If an exchange fails (FTX, Mt. Gox), you may lose everything. Self-custody means holding your own keys. This is the most important Bitcoin principle: if you don't control the keys, you don't control the bitcoin.

**Day 36 — What is a seed phrase? Why does it matter?**
A seed phrase is 12 or 24 random words that generate your private keys. Example: "apple boat cloud dawn eagle flame gold..." Write it on paper. Store it offline. Never photograph it. Never type it online. This is your master key to all your bitcoin. Lose it = lose your bitcoin forever.

**Day 37 — Why is keeping Bitcoin on an exchange risky?**
Exchanges: hold millions of users' bitcoin, are prime targets for hackers, can freeze withdrawals, can go bankrupt. Examples: Mt. Gox ($450M lost), FTX ($8B lost). Rule: use exchanges only to buy, then withdraw to your own wallet.

**Day 38 — If you share your public key, can you be tracked?**
Public address: safe to share (like your bank account number). Private key: NEVER share (like your PIN). Transactions are publicly visible — anyone with your address can see your history. Use new addresses for each transaction for better privacy.

**Day 39 — What does a public address do?**
A Bitcoin address is like an email address for money. Share it to receive bitcoin. It's derived mathematically from your public key, which is derived from your private key. You can generate unlimited addresses from one seed phrase. Never reuse addresses if privacy matters to you.

**Day 40 — Where does a Bitcoin transaction go?**
You broadcast a transaction → it enters the mempool → miners pick it up → include it in a block → block added to blockchain → transaction confirmed. Higher fee = faster confirmation (miners prioritize higher fees). Track your transaction live at mempool.space.

**Day 41 — Mempool.space: Watch your transaction live**
Mempool.space shows you: pending transactions waiting to be confirmed, current fee rates, which miner mined the latest block, Bitcoin network stats. It's the best free tool to understand what's happening on the Bitcoin network in real time.

**Day 42 — Bitcoin's 3 big goals and Layer 1**
Layer 1 (the base Bitcoin blockchain) prioritizes: (1) Security — hardest to attack, (2) Decentralization — anyone can participate, (3) Scarcity — 21M hard cap. Speed and cheapness are Layer 2's job. You can't have all four without tradeoffs — Bitcoin chooses the most important three.

**Day 43 — Lightning Network: For everyday transactions**
Lightning is a Layer 2 payment network on top of Bitcoin. Speed: instant. Fees: fractions of a cent. How: open a payment channel, transact off-chain, settle on-chain when done. Use cases: buying chai, tipping, small payments. Apps: Wallet of Satoshi, Phoenix, Breez.

**Day 44 — On-chain vs Off-chain: When to use which?**
On-chain: large amounts, long-term storage, cold storage, high security needed. Off-chain (Lightning): everyday spending, small amounts, instant payments. Think: on-chain = bank vault, Lightning = wallet in your pocket. Both use real bitcoin.

**Day 45 — Does Bitcoin waste energy?**
All monetary systems use energy. Gold mining uses massive energy. Banking data centers use enormous energy. Bitcoin uses energy to secure a global, permissionless monetary system. The question isn't "does it use energy" but "is the energy use justified?" Billions of people without banking access may say yes.

---

## Days 46–60: Energy, Critics & Big Picture

**Day 46 — How Bitcoin uses wasted energy**
Bitcoin miners are location-independent. They move to the cheapest energy sources — often stranded energy that would otherwise go to waste: flared gas from oil wells, excess hydropower, remote geothermal. Bitcoin actually creates economic incentive to capture and monetize wasted energy.

**Day 47 — Bitcoin vs other industries: The electricity truth**
Estimated annual energy use comparisons:
- Bitcoin: ~150 TWh/year
- Gold mining: ~130 TWh/year  
- Global banking system: ~260 TWh/year
- Christmas lights in the US alone: ~6 TWh/year
Context matters. Bitcoin secures a global monetary network for its energy cost.

**Day 48 — Bitcoin: A better use of electricity**
Bitcoin mining is interruptible and location-flexible — unlike other industries. Miners can shut down instantly when the grid needs power (demand response). This makes Bitcoin mining a potential stabilizer for electricity grids with variable renewable energy sources.

**Day 49 — Is Bitcoin mostly used for crime?**
Chainalysis data: illicit Bitcoin transactions = ~0.34% of total volume. Cash is used for far more crime as a percentage. Bitcoin's public ledger actually makes it a poor choice for criminals — every transaction is permanently traceable. Law enforcement regularly tracks and seizes Bitcoin from criminals.

**Day 50 — Why Bitcoin is the worst option for criminals**
Every transaction is permanently recorded. Blockchain analysis firms (Chainalysis, Elliptic) specialize in tracing Bitcoin. The US government has seized billions in Bitcoin from criminals. Compare: cash leaves no trace. Bitcoin leaves a permanent, public record.

**Day 51 — Crime or freedom? Bitcoin's real role**
In countries with hyperinflation (Venezuela, Zimbabwe, Nigeria), Bitcoin is a lifeline. Under authoritarian regimes, Bitcoin is a tool for financial freedom. The same properties that make it "useful for crime" make it useful for dissidents, activists, and the unbanked. Tool is neutral; use is not.

**Day 52 — Does Bitcoin have no value?**
Bitcoin has value because: (1) it's the most secure monetary network ever created, (2) it's the only provably scarce digital asset, (3) billions of people choose to use it, (4) it solves real problems for real people, (5) it costs real energy to produce. Value comes from what something does for people.

**Day 53 — Does money need to be "backed" by something?**
The US dollar was backed by gold until 1971. Now it's backed by... trust in the US government. The Indian rupee is backed by the RBI. Bitcoin is backed by math, energy, and global consensus. "Backed by something" doesn't automatically mean valuable — Zimbabwe's dollar was "backed" by their government.

**Day 54 — Is Bitcoin outdated technology?**
Bitcoin's protocol is intentionally conservative and slow-moving. Security and decentralization matter more than features. The base layer is stable; innovation happens on top (Lightning, Liquid, etc.). Being "boring" at the base layer is a feature, not a bug. The internet's base protocols (TCP/IP) haven't changed much either.

**Day 55 — If Bitcoin is outdated, why is it #1?**
Network effects. The most secure network. The most decentralized. The only one with no pre-mine, no CEO, no company behind it. Over 15 years of not being hacked. Lindy effect: the longer something survives, the more likely it continues to survive. Bitcoin's age is its proof of reliability.

**Day 56 — Other crypto: Just new digital paper money?**
Most altcoins have: a company or foundation behind them, pre-mines (founders got tokens first), can change rules by voting, no provable scarcity, no comparable security. Many are effectively unregistered securities. Bitcoin is the only one that genuinely solves the decentralization problem.

**Day 57 — Can the government ban Bitcoin?**
Governments can ban Bitcoin exchanges. They can make holding it illegal. They cannot destroy the protocol. The network runs on ~20,000 nodes worldwide. China "banned" Bitcoin in 2021 — Bitcoin continued running. Mining moved to other countries. The network never stopped.

**Day 58 — How do you ban a decentralized network?**
To truly stop Bitcoin: ban the internet, ban all computers, ban all electricity, coordinate with every government on Earth simultaneously, do it permanently. As long as two nodes can communicate, Bitcoin survives. The more authoritarian a government, the more its citizens may need Bitcoin.

**Day 59 — How does Bitcoin help a failing economy?**
In hyperinflation: your savings don't lose value overnight in Bitcoin. In capital controls: you can't be prevented from sending/receiving bitcoin. In corrupt banking: you don't need a bank account. Examples: El Salvador (legal tender), Nigeria (highest peer-to-peer volume), Venezuela (daily survival tool).

**Day 60 — What if you had invested ₹1,000 in Bitcoin in 2013?**
In 2013, 1 BTC ≈ ₹5,000. ₹1,000 would have bought 0.2 BTC.
At 2024 peak (~₹6,000,000/BTC): 0.2 BTC = ₹1,200,000.
That's 1,200x return. But: past performance ≠ future results. Bitcoin is volatile. Only invest what you can afford to lose completely. The point isn't the price — it's the technology and the freedom it enables.
