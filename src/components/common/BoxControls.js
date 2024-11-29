const BoxControls = ({
    boxDimensions,
    boxRotations,
    boxPositions,
    updateDimension,
    updateRotation,
    updatePosition,
}) => {
  const styles ={
      display: "flex",
      flexDirection: "row-reverse",
      alignItems: "center",
      padding: "10px",
      background: "rgba(0, 0, 0, 0.8)",
      borderRadius: "5px",
      color: "white",
  };

  return (
    <div style={styles}>
      <div>
          <label>
              Dim X:
              <input
                  type="number"
                  value={boxDimensions[0]}
                  onChange={(e) => updateDimension(0, e.target.value)}
                  style={{margin: "5px", width: "50px"}}
              />
          </label>
          <label>
              Dim Y:
              <input
                  type="number"
                  value={boxDimensions[1]}
                  onChange={(e) => updateDimension(1, e.target.value)}
                  style={{margin: "5px", width: "50px"}}
              />
          </label>
          <label>
              Dim Z:
              <input
                  type="number"
                  value={boxDimensions[2]}
                  onChange={(e) => updateDimension(2, e.target.value)}
                  style={{margin: "5px", width: "50px"}}
              />
          </label>
      </div>
      <div>
          <label>
              Rot X:
              <input
                  type="number"
                  value={boxRotations[0]}
                  onChange={(e) => updateRotation(0, e.target.value)}
                  style={{margin: "5px", width: "50px"}}
              />
          </label>
          <label>
              Rot Y:
              <input
                  type="number"
                  value={boxRotations[1]}
                  onChange={(e) => updateRotation(1, e.target.value)}
                  style={{margin: "5px", width: "50px"}}
              />
          </label>
          <label>
              Rot Z:
              <input
                  type="number"
                  value={boxRotations[2]}
                  onChange={(e) => updateRotation(2, e.target.value)}
                  style={{margin: "5px", width: "50px"}}
              />
          </label>
      </div>
      <div>
          <label>
              Pos X:
              <input
                  type="number"
                  value={boxPositions[0]}
                  onChange={(e) => updatePosition(0, e.target.value)}
                  style={{margin: "5px", width: "50px"}}
              />
          </label>
          <label>
              Pos Y:
              <input
                  type="number"
                  value={boxPositions[1]}
                  onChange={(e) => updatePosition(1, e.target.value)}
                  style={{margin: "5px", width: "50px"}}
              />
          </label>
          <label>
              Pos Z:
              <input
                  type="number"
                  value={boxPositions[2]}
                  onChange={(e) => updatePosition(2, e.target.value)}
                  style={{margin: "5px", width: "50px"}}
              />
          </label>
      </div>
  </div>
  );
};

export default BoxControls;