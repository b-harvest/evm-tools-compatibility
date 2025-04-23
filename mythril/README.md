$ myth analyze --rpc 127.0.0.1:8545 -a 0xDdb5De1bBcb8acd559fd6D843fFA253238eb96B7

==== Integer Arithmetic Bugs ====
SWC ID: 101
Severity: High
Contract: 0xDdb5De1bBcb8acd559fd6D843fFA253238eb96B7
Function name: name()
PC address: 3400
Estimated Gas Usage: 2581 - 3523
The arithmetic operator can underflow.
It is possible to cause an integer overflow or underflow in the arithmetic operation.
--------------------
Initial State:

Account: [ATTACKER], balance: 0x0, nonce:0, storage:{}
Account: [SOMEGUY], balance: 0x0, nonce:0, storage:{}

Transaction Sequence:

Caller: [CREATOR], function: name(), txdata: 0x06fdde03, value: 0x0

==== Integer Arithmetic Bugs ====
SWC ID: 101
Severity: High
Contract: 0xDdb5De1bBcb8acd559fd6D843fFA253238eb96B7
Function name: symbol() or link_classic_internal(uint64,int64)
PC address: 3400
Estimated Gas Usage: 2624 - 3566
The arithmetic operator can underflow.
It is possible to cause an integer overflow or underflow in the arithmetic operation.
--------------------
Initial State:

Account: [ATTACKER], balance: 0x0, nonce:0, storage:{}
Account: [SOMEGUY], balance: 0x0, nonce:0, storage:{}

Transaction Sequence:

Caller: [CREATOR], function: link_classic_internal(uint64,int64), txdata: 0x95d89b41, value: 0x0
