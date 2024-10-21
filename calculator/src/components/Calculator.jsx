import React, { useState, useEffect } from "react";
import "./Calculator.css";

const Calculator = () => {
    const [currentValue, setCurrentValue] = useState("0");
    const [pendingOperation, setpendingOperation] = useState(null);
    const [pendingValue, setpendingValue] = useState(null);
    const [completeOperation, setcompleteOperation] = useState("");
    const [history, setHistory] = useState([]);

    const keypadNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const operations = ["+", "-", "*", "/"];

    const handleClick = (value) => {
        setCurrentValue((prevValue) => {
            if (prevValue === "0") {
                return value;
            } else {
                return prevValue + value;
            }
        });
        setcompleteOperation((prevOperation) => prevOperation + value);
    };

    const handleOperation = (operation) => {
        setcompleteOperation(currentValue + " " + operation + " ");
        setpendingOperation(operation);
        setpendingValue(currentValue);
        setCurrentValue("0");
    };

    const handleClear = () => {
        setCurrentValue("0");
        setpendingOperation(null);
        setpendingValue(null);
        setcompleteOperation("");
        setHistory([]);
    };

    const handleBackspace = () => {
        setCurrentValue((prevValue) => {
            return prevValue.length > 1 ? prevValue.slice(0, -1) : "0";
        });
        setcompleteOperation((prevOperation) => prevOperation.slice(0, -1));
    };

    const handlePercent = () => {
        setCurrentValue((prevValue) => (parseFloat(prevValue) / 100).toString());
        setcompleteOperation((prevOperation) => prevOperation + "%");
    };

    const handleToggleSign = () => {
        setCurrentValue((prevValue) => (parseFloat(prevValue) * -1).toString());
        setcompleteOperation((prevOperation) => prevOperation + "±");
    };

    const handleCalculate = () => {
        if (!pendingOperation || !pendingValue) {
            return;
        }

        const num1 = parseFloat(pendingValue);
        const num2 = parseFloat(currentValue);

        let result;
        switch (pendingOperation) {
            case "+":
                result = num1 + num2;
                break;
            case "*":
                result = num1 * num2;
                break;
            case "-":
                result = num1 - num2;
                break;
            case "/":
                if (num2 !== 0) {
                    result = num1 / num2;
                } else {
                    setCurrentValue("Error");
                    setcompleteOperation("Error");
                    setpendingOperation(null);
                    setpendingValue(null);
                    return;
                }
                break;
            default:
                break;
        }

        const operationString = `${pendingValue} ${pendingOperation} ${currentValue} = ${result}`;
        setHistory((prevHistory) => [operationString, ...prevHistory]);
        setcompleteOperation(operationString);
        setCurrentValue(result.toString());
        setpendingOperation(null);
        setpendingValue(null);
    };

    useEffect(() => {
        const handleKeyPress = (event) => {
            const { key } = event;
            if (key >= "0" && key <= "9") {
                handleClick(key);
            } else if (operations.includes(key)) {
                handleOperation(key);
            } else if (key === "Enter") {
                handleCalculate();
            } else if (key === "Backspace") {
                handleBackspace();
            } else if (key === "Escape") {
                handleClear();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, []);

    return (
        <div className="calculator">
            <div className="complete-operation">{completeOperation}</div>
            <div className="display">{currentValue}</div>
            <div className="buttons">
                <button onClick={handleClear}>AC</button>
                <button onClick={handleBackspace}>⌫</button>
                <button onClick={handlePercent}>%</button>
                <button onClick={handleToggleSign}>±</button>
                {keypadNumbers.map((num) => (
                    <button key={num} onClick={() => handleClick(num)}>
                        {num}
                    </button>
                ))}
                {operations.map((operation) => (
                    <button
                        key={operation}
                        onClick={() => handleOperation(operation)}
                        className="operation-button"
                    >
                        {operation}
                    </button>
                ))}
                <button onClick={handleCalculate}>=</button>
            </div>
            <div className="history">
                {history.map((item, index) => (
                    <div key={index}>{item}</div>
                ))}
            </div>
        </div>
    );
};

export default Calculator;
