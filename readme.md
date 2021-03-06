# 4-Bit Computer

Check it out at [https://jacobsweeten.github.io/4-Bit-Computer/](https://jacobsweeten.github.io/4-Bit-Computer/)

## Example Code:
Draw Sonic (Sort of):
```
movi A 0
movi MB 15
stoi A 1
addi A 1
stoi A 1
addi A 1
stoi A 1
addi A 1
stoi A 15
addi A 1
stoi A 15
addi A 1
stoi A 1
addi A 1
stoi A 1
addi A 1
stoi A 1
addi A 1
stoi A 15
addi A 1
stoi A 1
addi A 1
stoi A 12
addi A 1
stoi A 1
addi A 1
stoi A 8
addi A 1
stoi A 15
addi A 1
stoi A 8
addi A 1
stoi A 15
```

Draw all the colors to the screen:
```
movi MB 15
movi A 0
movi C 15
sto A A
addi A 1
cmp A C
bneqi 3
sto A A
```

Call Functions:
```
# Establish Stack
movi MB 0
movi SB 15
movi SP 15

# Vars
movi A 7

# Get ready to call function
# Push return address
stoi SP 9
subi SP 1
stoi SP 0
subi SP 1

# Branch to function
bi 11

# After return
movi A 9

# Go to end
bi 36

# Function
# Establish stack
sto SP SB
subi SP 1
mov SB SP

# Push A
sto SP A
subi SP 1

# Do stuff
movi A 5

# Return
# Pop A
addi SP 1
load SP A

# Pop SB
addi SP 1
load SP SB

# Get return address
addi SP 1
loadpc2u SP
addi SP 1
load SP B
addpc2 B

# Ret
swappc
```

## Instruction Set (So Far)
- movi: Move immediate into register. Usage: `movi [Register] [Value]` Analog: `A = 1`
- mov: Move value in second register into first register. Usage: `mov [Register A] [Register B]` Analog: `A = B`
- addi: Add immediate to register and store in register. Sets overflow flag if result is greater than 15. `addi [Register] [Value]` Analog: `A = A + 1`
- stoi: Store immediate into memory at address in register. Usage: `stoi [Register] [Value]` Analog: `*A = 1`
- sto: Store value in second register into memory at address in first register. Usage: `stoi [Register A] [Register B]` Analog: `*A = B`
- subi: Subtrack immediate from register and store in register. Sets underflow flag if result is less than 0. Usage: `subi [Register] [Value]` Analog: `A = A - 1`
- muli: Multiply by immediate. Result is stored in HIGH:LOW. Usage: `muli [Register] [Value]`
- add: Add two registers and store in first register. Sets overflow flag if result is greater than 15. Usage: `add [Register A] [Register B]` Analog: `A = A + B`
- sub: Subtract two registers and store in first register. Sets underflow flag if result is less than 0. Usage: `sub [Register A] [Register B]` Analog: `A = A - B`
- load: Load value from memory at the address in first register and store in second register. Usage: `load [Register A] [Register B]` Analog: `B = *A`
- b: Jump to code at address in register. Usage: `b [Register]` Analog: `goto a`
- bi: Jump to code at immediate address. Usage: `bi [Value]`
- cmp: Compare two registers and set the EQ flag if they are equal. Usage: `cmp [Register A] [Register B]`
- beqi: Jump to code at immediate address if EQ flag is set. Usage: `beqi [Value]`
- beq: Jump to code at address in register if EQ flag is set. Usage: `beqi [Register]`
- bneqi: Jump to code at immediate address if EQ flag is not set. Usage: `bneqi [Value]`
- bneq: Jump to code at address in register if EQ flag is not set. Usage: `bneqi [Register]`
- addpc2i: Add immediate to PC2. Usage: `addpc2i [Value]`
- addpc2: Add value in register to PC2. Usage: `addpc2 [Register]`
- loadpc2u: Load upper 4 bits of PC2 from address in register. Usage: `loadpc2u [Register]`
- stopc2u: Store upper 4 bits of PC2 into address in register. Usage: `stopc2u [Register]`
- stopc2l: Store lower 4 bits of PC2 into address in register. Usage: `stopc2l [Register]`
- swappc: Move PC2 into PC. Usage: `swappc`

## Memory
The computer has 16 memory banks (0-15), selected by the MB register. Each bank holds 16 4-bit words (8 bytes). There is a total of 128 bytes in memory.

## The Screen
The screen uses 4-bit color (RGGB) and the screen buffer uses all of memory bank 15. Offset 0 is the top-left, and it continues from left-to-right, top-to-bottom.