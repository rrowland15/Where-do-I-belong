
let margin = { top: 50, bottom: 10, left: 50, right: 50 };
let height = window.innerHeight
let width = window.innerWidth

// enter code to create svg
let svg = d3.select("#map")
    .append("svg")
    .attr("id", "choropleth")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.bottom + margin.top)


// create a container for counties
let counties = svg.append("g")
    .attr("id", "counties")
    .attr("class", "Blues");

// create a container for states
var states = svg.append("g")
    .attr("id", "states");

let projection = d3.geoAlbersUsa().scale(1300).translate([width * 0.6, height / 1.9]);
let path = d3.geoPath().projection(projection);



let state_data = d3.json("static/us-states.json")
let county_data = d3.json("static/us-counties.json")

// Test Data here!!

let test_data_1 = d3.json(test_data)

console.log("This is test data!!", test_data_1)


console.log(state_data)
console.log(county_data)

let promises = [
    state_data,
    county_data,
    test_data_1
];


Promise.all(promises
    // enter code to read files
).then(
    // enter code to call ready() with required arguments
    function (d) {
        stateData = d[0];
        countyData = d[1];
        testData = d[2]
        //console.log("State Data", stateData);
        console.log("County Data", countyData);
        console.log("Test Data", testData);

        ready(stateData, countyData, testData);
    }

);

function ready(state, county, testdata) {
    const arrayColumn = (arr, n) => arr.map(x => x[n]);

    let test_data_fips = arrayColumn(testdata.data, 0)
    let test_score = arrayColumn(testdata.data, 1)

    function createObject(keys, values) {
        const obj = Object.fromEntries(
            keys.map((key, index) => [key, values[index]]),
        );

        return obj;
    }

    let test_score_obj = createObject(test_data_fips, test_score)

    console.log("Test Obj", test_score_obj)

    let color = d3.scaleQuantile().domain(test_score).range(d3.schemeBlues[4])




    svg.append("g")
        .attr("id", "states")
        .selectAll("path")
        .data(state.features)
        .enter()
        .append("path")
        .attr("stroke", "#000")
        .attr("d", path)
        .attr("fill", "none")


    svg.append("g")
        .attr("id", "counties")
        .selectAll("path")
        .data(county.features)
        .enter()
        .append("path")
        .attr("stroke", "#000")
        .attr("d", path)
        .attr("fill", function (d) {
            if (test_data_fips.includes(d.id)) {
                return color(test_score_obj[d.id])
            }
            else { return "#a6a6a6" }
        })


}

