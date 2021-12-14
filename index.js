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
	var temp = $("#codePanel").val().split("\n");
	computer.instructions = [];
	for(var i = 0; i < temp.length; i++)
	{
		if(temp[i].length != 0 && !temp[i].startsWith("#") && !/^\s+$/.test(temp[i]))
			computer.instructions.push(temp[i]);
	}
	
}

function run()
{
	computer.setRegister(PC, 0);
	computer.running = false;
	computer.fastMode = $("#fastMode").is(":checked");
	console.log(computer.fastMode);
	setInstructions();
	computer.running = true;
	computer.run();
}

function stop()
{
	computer.running = false;
}

function step()
{
	computer.step();
}

function cont()
{
	computer.running = true;
	computer.run();
}

function updateMemory()
{
	var bank = computer.memory[parseInt($("#memSelect").val())];
	var text = "";
	for(var i = 0; i < 16; i++)
	{
		text += "0x" + i.toString(16).toUpperCase() + ": " + bank[i].toString(2).padStart(4, 0) + "<br />";
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
	$("#AVal").text(computer.registers.A.toString(2).padStart(4, 0));
	$("#BVal").text(computer.registers.B.toString(2).padStart(4, 0));
	$("#CVal").text(computer.registers.C.toString(2).padStart(4, 0));
	$("#DVal").text(computer.registers.D.toString(2).padStart(4, 0));
	$("#EVal").text(computer.registers.E.toString(2).padStart(4, 0));
	$("#FVal").text(computer.registers.F.toString(2).padStart(4, 0));
	$("#GVal").text(computer.registers.G.toString(2).padStart(4, 0));
	$("#HVal").text(computer.registers.H.toString(2).padStart(4, 0));
	$("#MBVal").text(computer.registers.MB.toString(2).padStart(4, 0));
	$("#PCVal").text(computer.registers.PC.toString(2).padStart(8, 0));
	$("#PC2Val").text(computer.registers.PC2.toString(2).padStart(8, 0));
	$("#SPVal").text(computer.registers.SP.toString(2).padStart(4, 0));
	$("#SBVal").text(computer.registers.SB.toString(2).padStart(4, 0));
	$("#FLAGSVal").text(computer.registers.FLAGS.toString(2).padStart(4, 0));
	$("#HIGHVal").text(computer.registers.HIGH.toString(2).padStart(4, 0));
	$("#LOWVal").text(computer.registers.LOW.toString(2).padStart(4, 0));
}

function updateBreakPoints()
{
	computer.breakPoints = [];
	var breakPointArr = $("#breakPoints").val().split("\n");
	for(var i = 0; i < breakPointArr.length; i++)
	{
		computer.breakPoints.push(parseInt(breakPointArr[i]));
	}
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
		updateBreakPoints();
	}, 100);
}

$(() => {
	initElements();
});