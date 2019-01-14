var boardRows = 6;
var boardCols = 7;
var botPlaying = false;

$(function() { //on load
    printBoard(boardRows, boardCols);
    $("#resetBtn").click(function()
    {
        $( "#mainBoard" ).remove();
        printBoard(boardRows, boardCols);
    });
    $("#botPlayBtn").click(function()
    {
        botPlaying = !botPlaying;
    });
});

function printBoard(i_BoardRows, i_BoardCols)
{
    var turno = true;
    var gameover = false;
    var color = 'rgba(255, 0, 0, 0.8)';
    var emptyColor = "rgba(0, 0, 0, 0)";
    var startTime = 0;
    var winningCells = [];
    
    var lastPlayedRow = 0;
    var lastPlayedCol = 0;
    var lastColor = color;

    var maxRow = parseInt(i_BoardRows);
    var maxCol = parseInt(i_BoardCols);

    var myTable = $("<table id='mainBoard' oncontextmenu=\"return false\"></table>").appendTo("#board");
    for (var row = maxRow - 1; row >= 0; row--) {
        var myRow = $("<tr></tr>").appendTo(myTable);
        for (var col = 0; col < maxCol; col++)
            myRow.append("<td id='cell-" + row + "-" + col +"' ></td>");
    }
    $("#status").text("Red moves");


    $("td[id^=cell]").click(function()
    {
        if(gameover || animationRunning) return;
        
        coordinates = $(this).attr("id").split('-');
        playMove( parseInt(coordinates[1]), parseInt(coordinates[2]) );
    });
    
    function playMove(row, column)
    {
        lastPlayedCol = parseInt(column);
        lastPlayedRow = getAvailableRow( row, lastPlayedCol);
        
        if (lastPlayedRow != -1) {
            startTime = window.performance.now();
            lastColor = color;
            animateCoinFall();
        }
	}
    
    function onMovePlayed()
    {
		$('#cell-' + lastPlayedRow + '-' + lastPlayedCol).css("backgroundColor", color);
        
        if (lastPlayedRow == (maxRow -1) && checkDraw()) {
            setTimeout(function() { $("#status").text("DRAW"); }, 1);
            gameover = true;
            return;
        }
        
        if (checkVerticalWin(lastPlayedRow, lastPlayedCol) || 
            checkHorizontallWin(lastPlayedRow, lastPlayedCol) || 
            checkDiagonalWin(lastPlayedRow, lastPlayedCol) )
        {
            if (turno) 
                setTimeout(function() { $("#status").text("RED WINS!"); }, 1);
            else
                setTimeout(function() { $("#status").text("YELLOW WINS!"); }, 1);
            gameover = true;
            
            $('#cell-' + lastPlayedRow + '-' + lastPlayedCol).addClass("blinking");
            winningCells.forEach(function(element) {
				console.log(element);
				$(element).addClass("blinking");
			});
        }
        
        turnPlayers();
        
        if (botPlaying)
        {
			getBotMove();
		}
    }
    
    function turnPlayers()
    {
        if(turno){
            color = 'rgba(255, 255, 0, 0.8)';
            turno=false;
            $("#status").text("Yellow moves");
        }
        else{
            color = 'rgba(255, 0, 0, 0.8)';
            turno=true;
            $("#status").text("Red moves");
        }
    }

    function getAvailableRow(row, col)
    {
        for (var row = 0; row < maxRow; row++)
            if ( $('#cell-' + row + '-' + col).css('backgroundColor') == emptyColor)
                return row;
        return -1;
    }
    
    function checkVerticalWin(row, col)
    {
        var vertical = 0;

        for(var right = col + 1; right < boardCols; right++)
        {
            var rightCell = $('#cell-' + row + '-' + right);
            //console.log("rightCell: " + row + ", " + right + " bg-color: " + rightCell.css("backgroundColor") + " vs " + color);
            if( rightCell.css('backgroundColor') == color) {
                winningCells.push("#cell-" + row + '-' + right);
                vertical++;
			}
            else
                break;
        }
        
        for(var left = col - 1; left >= 0 ; left--)
        {
            var leftCell = $('#cell-' + row + '-' + left);
            if( leftCell.css('backgroundColor') == color) {
                winningCells.push("#cell-" + row + '-' + left);
                vertical++;
			}
            else
                break;
        }
        
        if (vertical >= 3) return true;
        winningCells = [];
        return false;
    }
    
    
    function checkHorizontallWin(row, col)
    {
        var horizontal = 0;

        for(var i = row - 1; i >= 0; i--)
        {
            var currentCell = $('#cell-' + i + '-' + col);
            if( currentCell.css('backgroundColor') == color) {
                winningCells.push("#cell-" + i + '-' + col);
                horizontal++;
			}
            else
                break;
        }
        if (horizontal >= 3) return true;
        winningCells = [];
        return false;
    }
    
    function checkDiagonalWin(row, col)
    {
        var cnt = 0;
        
        for(var i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--)
        {
            var currentCell = $('#cell-' + i + '-' + j);
            //console.log("currentCell: " + i + ", " + j + " bg-color: " + currentCell.css("backgroundColor") + " vs " + color);
            if( currentCell.css('backgroundColor') == color) {
                winningCells.push("#cell-" + i + '-' + j);
                cnt++;
			}
            else
                break;
        }
        
        for(var i = row + 1, j = col + 1; i < maxRow && j < maxCol; i++, j++)
        {
            var currentCell = $('#cell-' + i + '-' + j);
            if( currentCell.css('backgroundColor') == color) {
                winningCells.push("#cell-" + i + '-' + j);
                cnt++;
			}
            else
                break;
        }
        if (cnt >= 3) return true;
        
        winningCells = [];
        cnt = 0;
        
        for(var i = row + 1, j = col - 1; i < maxRow && j >= 0; i++, j--)
        {
            var currentCell = $('#cell-' + i + '-' + j);
            if( currentCell.css('backgroundColor') == color) {
                winningCells.push("#cell-" + i + '-' + j);
                cnt++;
			}
            else
                break;
        }
        
        for(var i = row - 1, j = col + 1; i >= 0 && j < maxCol; i--, j++)
        {
            var currentCell = $('#cell-' + i + '-' + j);
            if( currentCell.css('backgroundColor') == color) {
                winningCells.push("#cell-" + i + '-' + j);
                cnt++;
			}
            else
                break;
        }
        if (cnt >= 3) return true;
        winningCells = [];
        return false;
    }
    
    function checkDraw()
    {
        for(var column = 0; column < maxCol; column++)
        {
            var currentCell = $('#cell-' + (maxRow - 1) + '-' + column);
            if( currentCell.css('backgroundColor') == emptyColor)
                return false;
        }
        return true;
    }
    
    //// animation 
    let request
    
    var state = 0;
    var animationRunning = false;

    const animateCoinFall = () => {
        animationRunning = true;
        request = requestAnimationFrame(animateCoinFall)
        drawCoinFall();
    }
    const drawCoinFall = () =>
    {
        var emptyRow = -1;
        var currentTime = window.performance.now();
        var shouldQuit = false;
        
        // Additional check
        if (!animationRunning) {
            console.log("Even after animationRunning is canceled!");
            return;
        }
        
        var timeSlice = 40;
        var diff = currentTime - startTime;
        var row;
        if (diff < timeSlice)
        {
            row = maxRow - 1;
        }
        else if (diff < (2 * timeSlice))
        {
            row = maxRow - 2;
        }
        else if (diff < (3 * timeSlice))
        {
            row = maxRow - 3;
        }
        else if (diff < (4 * timeSlice))
        {
            row = maxRow - 4;
        }
        else if (diff < (5 * timeSlice))
        {
            row = maxRow - 5;
        }
        else {
            row = maxRow - 6;
        }
        
        var currentCell = $('#cell-' + row + '-' + lastPlayedCol);
        if (lastPlayedRow < row)
        {
            currentCell.css("backgroundColor", lastColor);
        }
        else shouldQuit = true;
        
        if (row < maxRow - 1)
        {
            var currentCell = $('#cell-' + (row + 1) + '-' + lastPlayedCol);
            if (currentCell.css("backgroundColor") != emptyColor)
                currentCell.css("backgroundColor", emptyColor);
        }
        
        if (shouldQuit) {
            animationRunning = false;
            cancelAnimationFrame(request);
            onMovePlayed();
        }
    }
    //// animation 

	function getBotMove()
	{
		if(gameover || animationRunning) return;
		const Url = "http://192.168.0.22:9090/getMove";
		$.get(Url, function(data, status)
		{
			var jsonString = JSON.stringify(data);
			var result = JSON.parse(jsonString);
			console.log("Reply: " + result);
			playMove( maxRow - 1, parseInt(result));
		});
	}

}

