import React from "react";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {BASE_URL} from "../../configs/configs";

export default function DeletableTipBox(props) {
  const handleDelete = () => {

    const headers = {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
    const body = { id: props.id };
    const path = "/v1/remove_tip";

    fetch(BASE_URL + path, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });
  };

  return (
    <div>
      <Card>
        <Box p={3}>
          <Box p={2}>
            <Typography gutterBottom variant="h4" component="h2">
              Tip
            </Typography>
            <Typography
              gutterBottom
              variant="body2"
              color="textSecondary"
              component="p"
            >
              {props.content}
            </Typography>
          </Box>
          <Box align={"right"}>
            <Button size="small" color="primary" onClick={handleDelete}>
              Delete
            </Button>
          </Box>
        </Box>
      </Card>
    </div>
  );
}
