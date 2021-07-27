import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import LoggedInNavBar from "../nav/LoggedInNavBar";
import Typography from "@material-ui/core/Typography";
import SmileyGroup from "../diary/SmileyGroup";
import SLLineChart from "./SLLineChart";
import SLBarChart from "./SLBarChart";
import SLPieChart from "./SLPieChart";
import {BASE_URL} from "../../configs/configs";

export default class Summary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      morningFeeling: 0,
      hoursData: [],
      caffeineMorningData: [],
      caffeineAfternoon: [],
      caffeineEvening: [],
      napMorning: [],
      napAfternoon: [],
      napEvening: [],
    };
  }

  handleMorningFeelingChange = (e, newToggling) => {
    this.setState({ morningFeeling: newToggling });
  };

  // Converts data from backend into BarChart input format
  toBarChartData = (data, fieldName) => {
    let XYData = [];
    data[fieldName].forEach((k) =>
      XYData.push({
        x:
          k[fieldName] === 0
            ? "None"
            : k[fieldName] === 1
            ? "Low"
            : k[fieldName] === 2
            ? "Medium"
            : "High",
        y: k.count,
      })
    );
    const LEVEL_LABELS = ["None", "Low", "Medium", "High"];
    return XYData.sort((first, second) => LEVEL_LABELS.indexOf(first.x) >= LEVEL_LABELS.indexOf(second.x));
  };

  // Converts data from backend into LineChart format
  toLineChartData = (data, fieldName) => {
    let XYData = [];
    data[fieldName].forEach((k) =>
      XYData.push({
        x: k[fieldName],
        y: k.count,
      })
    );
    return XYData.sort((first, second) => first.x >= second.x);
  };

  // Converts data from backend into Pie input format
  toPieData = (data, fieldName) => {
    let XYData = [];
    data[fieldName].forEach((k) =>
      XYData.push({ x: k[fieldName] ? "Yes" : "No", y: k.count })
    );
    return XYData.sort((a, b) => (a.x === "Yes" ? -1 : 1));
  };

  componentDidMount() {

    const headers = {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
      Authorization: "Bearer " + localStorage.getItem("token"),
    };

    let url = new URL(BASE_URL + "/v1/graphing");

    const params = {
      morning_feeling: this.state.morningFeeling,
    };

    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    fetch(url, {
      method: "GET",
      headers: headers,
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          hoursData: this.toLineChartData(data, "hours"),
          caffeineMorning: this.toBarChartData(data, "caffeine_morning"),
          caffeineAfternoon: this.toBarChartData(data, "caffeine_afternoon"),
          caffeineEvening: this.toBarChartData(data, "caffeine_evening"),
          napMorning: this.toPieData(data, "nap_morning"),
          napAfternoon: this.toPieData(data, "nap_afternoon"),
          napEvening: this.toPieData(data, "nap_evening"),
        });
      });
  }

  componentDidUpdate() {

    const headers = {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
      Authorization: "Bearer " + localStorage.getItem("token"),
    };

    let url = new URL(BASE_URL + "/v1/graphing");

    const params = {
      morning_feeling: this.state.morningFeeling,
    };

    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    fetch(url, {
      method: "GET",
      headers: headers,
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          hoursData: this.toLineChartData(data, "hours"),
          caffeineMorning: this.toBarChartData(data, "caffeine_morning"),
          caffeineAfternoon: this.toBarChartData(data, "caffeine_afternoon"),
          caffeineEvening: this.toBarChartData(data, "caffeine_evening"),
          napMorning: this.toPieData(data, "nap_morning"),
          napAfternoon: this.toPieData(data, "nap_afternoon"),
          napEvening: this.toPieData(data, "nap_evening"),
        });
      });
  }

  render() {
    return (
      <div>
        <LoggedInNavBar history={this.props.history} />
        <Box px={"20%"} align={"center"}>
          <Card>
            <Box p={"5%"}>
              <Typography variant={"h6"}>
                View days when you wake up feeling
              </Typography>
            </Box>
            <Box p={"5%"}>
              <SmileyGroup
                toggling={this.state.morningFeeling}
                onChange={this.handleMorningFeelingChange}
              />
            </Box>
            <Grid container item md={4} sm={6} xs={12}>
              <Typography variant={"h6"} display="inline">
                Hours of sleep
              </Typography>
              <SLLineChart
                data={this.state.hoursData.sort((a, b) => a.x - b.x)}
                XLabel={"Hours of sleep"}
              />
            </Grid>
            <Grid container item md={4} sm={6} xs={12}>
              <Typography variant={"h6"}>Caffeine morning</Typography>
              <SLBarChart
                data={this.state.caffeineMorning}
                XLabel={"Morning caffeine"}
              />
            </Grid>
            <Grid container item md={4} sm={6} xs={12}>
              <Typography variant={"h6"}>Caffeine afternoon</Typography>
              <SLBarChart
                data={this.state.caffeineAfternoon}
                XLabel={"Afternoon caffeine"}
              />
            </Grid>
            <Grid container item md={4} sm={6} xs={12}>
              <Typography variant={"h6"} display="inline">
                Caffeine evening the day before
              </Typography>
              <SLBarChart
                data={this.state.caffeineEvening}
                XLabel={"Evening caffeine"}
              />
            </Grid>
            <Grid container item md={4} sm={6} xs={12}>
              <Typography variant={"h6"} display="inline">
                Morning nap the day before
              </Typography>
              <SLPieChart data={this.state.napMorning} />
            </Grid>
            <Grid container item md={4} sm={6} xs={12}>
              <Typography variant={"h6"} display="inline">
                Afternoon nap the day before
              </Typography>
              <SLPieChart data={this.state.napAfternoon} />
            </Grid>
            <Grid container item md={4} sm={6} xs={12}>
              <Typography variant={"h6"} display="inline">
                Evening nap the day before
              </Typography>
              <SLPieChart data={this.state.napEvening} />
            </Grid>
          </Card>
        </Box>
      </div>
    );
  }
}
