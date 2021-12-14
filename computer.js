const A = "A";
const B = "B";
const C = "C";
const D = "D";
const E = "E";
const F = "F";
const G = "G";
const H = "H";
const MB = "MB";
const PC = "PC";
const SP = "SP";
const SB = "SB";
const FLAGS = "FLAGS";
const HIGH = "HIGH";
const LOW = "LOW";

const speed = 1000000;	// 1 MHz

function Registers(){
	this.A = 0;			// Registers A-H
	this.B = 0;
	this.C = 0;
	this.D = 0;
	this.E = 0;
	this.F = 0;
	this.G = 0;
	this.H = 0;
	this.MB = 0;		// Memory Bank
	this.PC = 0;		// Program Counter
	this.SP = 0;		// Stack Pointer
	this.SB = 0;		// Stack Base
	this.FLAGS = 0;		// FLAGS (0 = Overflow, 1 = Underflow, 2 = EQ)
	this.HIGH = 0;
	this.LOW = 0;
}

function Computer()
{
	this.instructions = [];

	this.memory = [];

	for(var i = 0; i < 16; i++)
	{
		var newBank = [];
		for(var j = 0; j < 16; j++)
		{
			newBank[j] = 0;
		}

		this.memory.push(newBank);
	}
	
	this.breakPoints = [];

	this.registers = new Registers();

	this.running = false;

	this.setRegister = function(reg, val) {
		if(val instanceof String || typeof(val) === "string")
			val = parseInt(val);
		
		if((val > 0xF || val < 0x0) && reg != PC)
			throw new Error("Value out of range.");
		
		this.registers[reg] = val;
	}

	this.touchMemory = function(addr, val)
	{
		if(val instanceof String || typeof(val) === "string")
			val = parseInt(val);

		var bank = this.memory[this.registers.MB];
		bank[addr] = val;
	}

	this.readMemory = function(addr)
	{
		var bank = this.memory[this.registers.MB];
		return bank[addr];
	}

	this.incrementPC = function()
	{
		this.setRegister(PC, this.registers.PC + 1);
	}

	this.execute = function()
	{
		var instruction = this.instructions[this.registers.PC];
		//console.log("Executing instruction " + instruction);
		var instructionArr = instruction.split(/\s/);
		switch(instructionArr[0])
		{
			case "movi":
				this.setRegister(instructionArr[1], parseInt(instructionArr[2]));
				this.incrementPC();
				break;
			case "add":
				var sum = this.registers[instructionArr[1]] + this.registers[instructionArr[2]];
				if(sum > 0xF)
				{
					this.registers.FLAGS = this.registers.FLAGS | 0b1000;
					sum = sum & 0b1111;
				}
				else
				{
					this.registers.FLAGS = this.registers.FLAGS & 0b0111;
				}

				this.setRegister(instructionArr[1], sum);
				this.incrementPC();
				break;
			case "addi":
				var sum = this.registers[instructionArr[1]] + parseInt(instructionArr[2]);
				if(sum > 0xF)
				{
					this.registers.FLAGS = this.registers.FLAGS | 0b1000;
					sum = sum & 0b1111;
				}
				else
				{
					this.registers.FLAGS = this.registers.FLAGS & 0b0111;
				}

				this.setRegister(instructionArr[1], sum);
				this.incrementPC();
				break;
			case "stoi":
				this.touchMemory(this.registers[instructionArr[1]], instructionArr[2]);
				this.incrementPC();
				break;
			case "sto":
				this.touchMemory(this.registers[instructionArr[1]], this.registers[instructionArr[2]]);
				this.incrementPC();
				break;
			case "subi":
				var res = this.registers[instructionArr[1]] - parseInt(instructionArr[2]);
				if(res < 0)
				{
					this.registers.FLAGS = this.registers.FLAGS | 0b0100;
					res = 0;
				}
				else
				{
					this.registers.FLAGS = this.registers.FLAGS & 0b1011;
				}

				this.setRegister(instructionArr[1], res);
				this.incrementPC();
				break;
			case "muli":
				var res = this.registers[instructionArr[1]] * parseInt(instructionArr[2]);
				this.setRegister(HIGH, res >> 4);
				this.setRegister(LOW, res & 0b1111);
				this.incrementPC();
				break;
			case "sub":
				var res = this.registers[instructionArr[1]] - this.registers[instructionArr[2]];
				if(res < 0)
				{
					this.registers.FLAGS = this.registers.FLAGS | 0b0100;
					res = 0;
				}
				else
				{
					this.registers.FLAGS = this.registers.FLAGS & 0b1011;
				}

				this.setRegister(instructionArr[1], res);
				this.incrementPC();
				break;
			case "load":
				this.setRegister(instructionArr[2], this.readMemory(this.registers[instructionArr[1]]));
				this.incrementPC();
				break;
			case "b":
				this.setRegister(PC, this.registers[instructionArr[1]]);
				break;
			case "bi":
				this.setRegister(PC, instructionArr[1]);
				break;
			case "cmp":
				if(this.registers[instructionArr[1]] === this.registers[instructionArr[2]])
					this.registers.FLAGS = this.registers.FLAGS | 0b0010;
				else
					this.registers.FLAGS = this.registers.FLAGS & 0b1101;
				this.incrementPC();
				break;
			case "beq":
				if((this.registers.FLAGS & 0b0010) === 2)
					this.setRegister(PC, this.registers[instructionArr[1]]);
				else
					this.incrementPC();
				break;
			case "beqi":
				if((this.registers.FLAGS & 0b0010) === 2)
					this.setRegister(PC, instructionArr[1]);
				else
					this.incrementPC();
				break;
			case "bneq":
				if((this.registers.FLAGS & 0b0010) != 2)
					this.setRegister(PC, this.registers[instructionArr[1]]);
				else
					this.incrementPC();
				break;
			case "bneqi":
				if((this.registers.FLAGS & 0b0010) != 2)
					this.setRegister(PC, instructionArr[1]);
				else
					this.incrementPC();
				break;
			default:
				throw new Error("Bad instruction!");
		}
	}

	this.step = function()
	{
		if(this.registers.PC > this.instructions.length - 1)
		{
			return;
		}

		try
		{
			this.execute();
		}
		catch(e)
		{
			this.running = false;
			setOutput(e);
			return;
		}
	}

	this.tick = function()
	{
		if(!this.running)
			return;
		
		for(var i = 0; i < this.breakPoints.length; i++)
		{
			if(this.registers.PC === this.breakPoints[i])
			{
				this.running = false;
				return;
			}
		}

		if(this.registers.PC > this.instructions.length - 1)
		{
			this.running = false;
			return;
		}

		try
		{
			this.execute();
		}
		catch(e)
		{
			this.running = false;
			setOutput(e);
			return;
		}
	}

	let thisComputer = this;
	setInterval(() => {
		thisComputer.tick();
	}, (1 / speed) * 1000);
}