








import React, { useState, useEffect } from "react";
import "./Grid.css";
import axios from "axios";

const Grid = ({ m = 10, n = 10 }) => {
    const initializeGrid = (m, n) => {
        return Array.from({ length: m }, (_, row) =>
            Array.from({ length: n }, (_, col) => ({
                row,
                col,
                name: null,
                color: "white",
                isClicked: false,
                isGasStation: false,
                isHouse: false,
                isWall: false,
            }))
        );
    };

    const [grid, setGrid] = useState(initializeGrid(m, n));
    const [colorAndName, setColorAndName] = useState([]);


    const [restrictedGasZone, setRestrictedGasZone] = useState([]);
    const [allowedGasZone, setAllowedGasZone] = useState([]);


    const [gasNodes, setGasNodes] = useState([]);
    const [houseNodes, setHouseNodes] = useState([]);
    const [wallNodes, setWallNodes] = useState([]);


    const [pathData, setPathData] = useState([]);
    const [optimizePathData, setOptimizePathData] = useState([]);


    const [selectedMap, setSelectedMap] = useState("Map1");

      // Effect to animate the path construction after fetching path data
    useEffect(() => {
        if (Array.isArray(pathData) && pathData.length > 0) {
            pathData.forEach(([row, col], i) => {
                setTimeout(() => {
                    constructPath(row, col);
                }, i * 20);
            });
        }
    }, [pathData]);

      // Effect to animate the optimized path after fetching optimize path data
    useEffect(() => {
        if (Array.isArray(optimizePathData) && optimizePathData.length > 0) {
            optimizePathData.forEach(([row, col], i) => {
                setTimeout(() => {
                    optimizePath(row, col);
                }, i * 20);
            });
        }
    }, [optimizePathData]);

    const fetchMap = async (mapName) => {
        try {
        //    const res = await axios.get(`http://127.0.0.1:8000/map/${mapName}`);
            const { gas, house, wall } = res.data;


            
      // Reset grid and node lists
            const newGrid = initializeGrid(m, n);
            const gasList = [];
            const houseList = [];
            const wallList = [];

            // Place gas stations on grid
            gas.forEach(([x, y]) => {
                newGrid[x][y] = {
                    ...newGrid[x][y],
                    name: "G",
                    color: "rgb(250, 17, 4)",
                    isGasStation: true,
                };
                gasList.push({ x, y });
            });

              // Place houses on grid
            house.forEach(([x, y]) => {
                newGrid[x][y] = {
                    ...newGrid[x][y],
                    name: "H",
                    color: "rgb(5, 254, 63)",
                    isHouse: true,
                };
                houseList.push({ x, y });
            });

            // Place walls on grid
            wall.forEach(([x, y]) => {
                newGrid[x][y] = {
                    ...newGrid[x][y],
                    name: "W",
                    color: "rgb(20, 20, 22)",
                    isWall: true,
                };
                wallList.push({ x, y });
            });

              // Update states
            setGrid(newGrid);
            setGasNodes(gasList);
            setHouseNodes(houseList);
            setWallNodes(wallList);
        } catch (err) {
            console.error("Error fetching map data:", err);
        }
    };

    const setCellAsGasStation = () => {
        setColorAndName(["rgb(250, 17, 4)", "G"]);
        const gasCells = [];
        grid.forEach(row => {
            row.forEach(cell => {
                if (cell.isGasStation) gasCells.push(cell);
            });
        });

        const restricted = new Set();
        gasCells.forEach(gs => {
            for (let r = 0; r < m; r++) {
                for (let c = 0; c < n; c++) {
                    const distance = Math.abs(gs.row - r) + Math.abs(gs.col - c);
                    if (distance <= 10) {
                        restricted.add(`${r}-${c}`);
                    }
                }
            }
        });


        const allowed = [];
        for (let r = 0; r < m; r++) {
            for (let c = 0; c < n; c++) {
                const key = `${r}-${c}`;
                const cell = grid[r][c];
                if (
                    !restricted.has(key) &&
                    !cell.isGasStation &&
                    !cell.isHouse &&
                    !cell.isWall
                ) {
                    allowed.push(key);
                }
            }
        }

        setRestrictedGasZone(Array.from(restricted));
        setAllowedGasZone(allowed);
    };

      // Set current mode to place Houses with green color and 'H' name
    const setCellAsHouse = () => {
        setColorAndName(["rgb(5, 254, 63)", "H"]);
        setRestrictedGasZone([]);
        setAllowedGasZone([]);
    };

    
  // Set current mode to place Walls with dark color and 'W' name
    const setCellAsWall = () => {
        setColorAndName(["rgb(20, 20, 22)", "W"]);
        setRestrictedGasZone([]);
        setAllowedGasZone([]);
    };

    
  // Function to color path cells red as part of path visualization animation
    const constructPath = (row, col) => {
        setGrid(prevGrid => {
            const newGrid = prevGrid.map(rowArr => [...rowArr]);
            newGrid[row][col] = {
                ...newGrid[row][col],
                name: newGrid[row][col].name === null ? " " : newGrid[row][col].name,
                color: newGrid[row][col].color === "white" ? "red" : newGrid[row][col].color,
            };
            return newGrid;
        });
    };

    const optimizePath = (row, col) => {
        setGrid(prevGrid => {
            const newGrid = prevGrid.map(rowArr => [...rowArr]);
            newGrid[row][col] = {
                ...newGrid[row][col],
                name: newGrid[row][col].name === " " ? " " : newGrid[row][col].name,
                color: newGrid[row][col].color === "red" ? "yellow" : newGrid[row][col].color,
            };
            return newGrid;
        });
    };


    
  // Clears the grid and resets all states to initial values
    const clearGrid = () => {
        setGrid(initializeGrid(m, n));
        setColorAndName([]);
        setRestrictedGasZone([]);
        setAllowedGasZone([]);
        setGasNodes([]);
        setHouseNodes([]);
        setWallNodes([]);
        setPathData([]);
        setOptimizePathData([]);
    };


    // Render appropriate image inside each cell based on cell type
    const renderCellContent = (color, name) => {
        if (name === "G") {
            return <img src="src/images/GAS.png" alt="Gas" className="cell-image" />;
        } else if (name === "H") {
            return <img src="src/images/house.jpg" alt="House" className="cell-image" />;
        } else if (name === "W") {
            return <img src="src/images/wall.png" alt="Wall" className="cell-image" />;
        } else {
            return null;
        }
    };

    const handleCellClick = (row, col) => {
        setGrid(prevGrid => {
            const newGrid = prevGrid.map(rowArr => [...rowArr]);
            const cell = newGrid[row][col];

            if (["G", "H", "W"].includes(cell.name)) return newGrid;

            if (colorAndName[1] === "G") {
                for (let r = 0; r < m; r++) {
                    for (let c = 0; c < n; c++) {
                        const other = newGrid[r][c];
                        const distance = Math.abs(r - row) + Math.abs(c - col);
                        if (other.isGasStation && distance <= 10) {
                            alert("Only one Gas Station allowed within a 10-block range.");
                            return prevGrid;
                        }
                    }
                }
            }

            if (
                (cell.isGasStation && colorAndName[1] === "H") ||
                (cell.isHouse && colorAndName[1] === "G") ||
                (cell.isWall && colorAndName[1] !== "W")
            ) {
                return prevGrid;
            }


            // Update the clicked cell with new properties based on selected type
            newGrid[row][col] = {
                ...cell,
                name: colorAndName[1],
                color: colorAndName[0],
                isClicked: true,
                isGasStation: colorAndName[1] === "G" ? true : cell.isGasStation,
                isHouse: colorAndName[1] === "H" ? true : cell.isHouse,
                isWall: colorAndName[1] === "W" ? true : cell.isWall,
            };

            const updateNodes = (setter, row, col) => {
                setter(prev => [...prev, { x: row, y: col }]);
            };

            if (colorAndName[1] === "H") updateNodes(setHouseNodes, row, col);
            else if (colorAndName[1] === "G") updateNodes(setGasNodes, row, col);
            else updateNodes(setWallNodes, row, col);

            return newGrid;
        });
    };


      // Send current grid data to backend API for path calculati
    const sendDataToAPI = async () => {
        const payload = {
            houseNodes: houseNodes.map(({ x, y }) => [x, y]),
            gasNodes: gasNodes.map(({ x, y }) => [x, y]),
            wallNodes: wallNodes.map(({ x, y }) => [x, y]),
            grid_size: [m, n],
        };

        console.log("Sending Data:", payload);

        try {
            const res = await axios.post("http://127.0.0.1:8000/post", payload, {
                headers: { "Content-Type": "application/json" },
            });
            alert(res.data.message);
        } catch (err) {
            console.error("Error posting data:", err);
        }

        try {
            const res = await axios.get("http://127.0.0.1:8000/show");
            setPathData(res.data.path);
        } catch (err) {
            console.error("Error fetching path data:", err);
        }
    };

    const getOptimize = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/optimize");
            setOptimizePathData(res.data.path);
        } catch (err) {
            console.error("Error fetching optimized data:", err);
        }
    };

    return (
        <div className="grid-container">
            <div className="grid_class" id="grid">
                <h1 className="grid_h1">
                  GAS PIPELINE
                  
                </h1>

                <div className="gridButton">
                    <div className="leftgridButton">
                        
                    <button onClick={setCellAsGasStation}>Set Gas Station</button>
                    <button onClick={setCellAsHouse}>Set House</button>
                    <button onClick={setCellAsWall}>Set Wall</button>
                    <button onClick={sendDataToAPI}>Send Data</button>
                    <button onClick={getOptimize}>Optimize</button>
                    <button onClick={clearGrid}>Clear Grid</button>
                    </div>

                <div className="rightgridButton">
                        <select value={selectedMap} onChange={(e) => {
                        setSelectedMap(e.target.value);
                        fetchMap(e.target.value);
                    }}>
                        <option value="Map1">Map 1</option>
                        <option value="Map2">Map 2</option>
                        <option value="Map3">Map 3</option>
                    </select>
                </div>
                </div>

                <div className="grid_content">
                    <table className="gridTable">
                        <tbody>
                            {grid.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={`cell 
                                                ${["G", "H", "W"].includes(cell.name) ? "clicked" : ""} 
                                                ${cell.color === "red" ? "path" : ""} 
                                                ${cell.color === "yellow" ? "optimize" : ""}`}
                                            style={{
                                                backgroundColor: cell.color,
                                                outline:
                                                    colorAndName[1] === "G"
                                                        ? restrictedGasZone.includes(`${cell.row}-${cell.col}`)
                                                            ? "2px dashed red"
                                                            : allowedGasZone.includes(`${cell.row}-${cell.col}`)
                                                                ? "2px solid limegreen"
                                                                : "none"
                                                        : "none",
                                                color: "black",
                                                border: "1px solid blue",
                                                cursor: "pointer",
                                                position: "relative",
                                                fontSize: "12px",
                                                padding: "2px",
                                            }}
                                            onClick={() => handleCellClick(cell.row, cell.col)}
                                        >
                                            {["G", "H", "W"].includes(cell.name) ? null : (rowIndex * grid[0].length) + colIndex + 1}
                                            {renderCellContent(cell.color, cell.name)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Grid;
















