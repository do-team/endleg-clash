Endleg - clash mechanism
========================

Clash will receive pair of players with their cards and evaluate a winner.  
Then it updates tables in DynamoDB accordingly - sets a fightflag to 0 (forcing players to send new set of cards) and also saves their overall score into second table.  

See [main repository](https://github.com/do-team/endleg) for more details.