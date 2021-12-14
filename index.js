var pixels = [];
var computer;

function convertColor(smallColor)
{
	if(smallColor instanceof String || typeof(smallColor) === "string")
	{
		if(/^#[0-9A-F]$/.test(smallColor))
		{
			smallColor = parseInt(smallColor.split("#")[1], 16);
		}
		else
		{
			throw new Error("Bad color");
		}
	}

	var R = smallColor >> 3;
	var G = (smallColor >> 1) & 0b11;
	var B = smallColor & 0b1;

	var hexR = R * 0xFF;
	var hexG = (G / 3) * 0xFF;
	var hexB = B * 0xFF;

	var finalHex = (hexR << 16) + (hexG << 8) + hexB;

	return "#" + finalHex.toString(16).padStart(6, 0);
}

function Pixel(element)
{
	this.color = 0b0000;
	this.element = element;
	
	this.update = function()
	{
		this.element.style.backgroundColor = convertColor(this.color);
	}
}

function setOutput(str)
{
	$("#output").text(str);
}

function setInstructions()
{
	computer.instructions = $("#codePanel").val().split("\n");
}

function run()
{
	computer.setRegister(PC, 0);
	computer.running = false;
	setInstructions();
	computer.running = true;
}

function stop()
{
	computer.running = false;
}

function updateMemory()
{
	var bank = computer.memory[parseInt($("#memSelect").val())];
	var text = "";
	for(var i = 0; i < 16; i++)
	{
		text += "0x" + i.toString(16).toUpperCase() + ": " + bank[i] + "<br />";
	}

	$("#memory").html(text);
}

function updateScreen()
{
	for(var i = 0; i < 16; i++)
	{
		pixels[i].color = computer.memory[15][i];
		pixels[i].update();
	}
}

function updateStatus()
{
	$("#AVal").text(computer.registers.A);
	$("#BVal").text(computer.registers.B);
	$("#CVal").text(computer.registers.C);
	$("#DVal").text(computer.registers.D);
	$("#EVal").text(computer.registers.E);
	$("#FVal").text(computer.registers.F);
	$("#GVal").text(computer.registers.G);
	$("#HVal").text(computer.registers.H);
	$("#MBVal").text(computer.registers.MB);
	$("#PCVal").text(computer.registers.PC);
	$("#SPVal").text(computer.registers.SP);
	$("#SBVal").text(computer.registers.SB);
	$("#FLAGSVal").text(computer.registers.FLAGS);
}

function initElements()
{
	var screenPanelDim = screen.width * 0.3;
	$("#screenPanel").width(screenPanelDim);
	$("#screenPanel").height(screenPanelDim);

	for(var i = 0; i < 16; i++)
	{
		var pixelElement = document.createElement("div");
		pixelElement.classList.add("screenPixel");
		pixelElement.style.width = (screenPanelDim / 4) + "px";
		pixelElement.style.height = (screenPanelDim / 4) + "px";
		$("#screenPanel").append(pixelElement);
		var newPixel = new Pixel(pixelElement);
		pixels.push(newPixel);
	}
	
	computer = new Computer();

	setInterval(() => {
		updateStatus();
		updateScreen();
		updateMemory();
	}, 100);
}

$(() => {
	initElements();
});