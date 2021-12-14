# 4-Bit Computer

Check it out at [https://jacobsweeten.github.io/4-Bit-Computer/](https://jacobsweeten.github.io/4-Bit-Computer/)

## Example Code:
The following code draws Sonic (Sort of):
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

## Instruction Set (So Far)
- movi: Move immediate into register. Usage: `movi [Register] [Value]` Analog: `A = 1`
- addi: Add immediate to register and store in register. `addi [Register] [Value]` Analog: `A = A + 1`
- stoi: Store immediate into memory at address in register. Usage: `stoi [Register] [Value]` Analog: `*A = 1`

## Memory
The computer has 16 memory banks (0-15), selected by the MB register. Each bank holds 16 4-bit words (8 bytes). There is a total of 128 bytes in memory.

## The Screen
The screen uses 4-bit color (RGGB) and the screen buffer uses all of memory bank 15. Offset 0 is the top-left, and it continues from left-to-right, top-to-bottom.