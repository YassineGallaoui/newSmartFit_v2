import React, { Component, useEffect, useState } from "react";
import Link from "next/link";
import { collapsibleDivs } from "../../utils";
import axiosInstance from "pages/axiosInstance";

const RuleBigDiv = (props) => (
  <div className="row">
    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
      <div className="card">
        <div className="accordion" id={"accordion-" + props.rule._id}>
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse-" + props.rule._id} aria-expanded="true" aria-controls="collapseOne">
                {props.rule.name}
              </button>
            </h2>
            <div id={"collapse-" + props.rule._id} className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent={'#accordion-' + props.rule._id}>
              <div className="accordion-body">
                <div className="card-body">
                  <div className="card-text">
                    <div className="row">
                      <div className="order-md-last col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-3">
                        <button
                          type="button"
                          className="btn btn-outline-danger float-left float-md-right ml-xl-3"
                          onClick={() => {
                            if (window.confirm("Sure you want to delete this rule?"))
                              props.delete(props.rule._id);
                          }}
                          style={{ float: "right" }}
                        >
                          Delete Rule
                        </button>
                        <Link href={"/updateRule?ruleId=" + props.rule._id}>
                          <button
                            type="button"
                            className="btn btn-outline-warning float-left float-md-right mt-md-2 mt-xl-0"
                            style={{
                              marginLeft: "10px",
                              marginRight: "10px",
                              float: "right",
                            }}
                          >
                            Edit Rule
                          </button>
                        </Link>
                      </div>

                      <div className="col-sm-12 col-md-5 col-lg-5 col-xl- mb-3">
                        <h6>
                          <label>Athletes</label>
                        </h6>
                        <ul>
                          {props.rule.athletesId.map((currentAthlete, index) => {
                            let name = "";
                            let arr = props.athletes;
                            for (let i = 0; i < arr.length; i++) {
                              if (arr[i]._id === currentAthlete) name = arr[i].name;
                            }
                            return (
                              <li key={index}>{name + " ~ " + currentAthlete}</li>
                            );
                          })}
                        </ul>
                        <label>
                          {props.rule.suggestedAthletesId.filter(
                            (el) =>
                              props.rule.athletesId.indexOf(
                                el.substring(el.indexOf("~ ") + 2)
                              ) === -1
                          ).length > 0
                            ? "Other Suggested Athletes:"
                            : "No Other Suggested Athletes"}
                        </label>
                        <ul>
                          {props.rule.suggestedAthletesId
                            .filter(
                              (el) =>
                                props.rule.athletesId.indexOf(
                                  el.substring(el.indexOf("~ ") + 2)
                                ) === -1
                            )
                            .map((currentSuggestedAthlete, index) => {
                              return <li key={index}>{currentSuggestedAthlete}</li>;
                            })}
                        </ul>
                      </div>

                      <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-3">
                        <h6>
                          <label>Message</label>
                        </h6>
                        <span>{props.rule.message}</span>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-12 col-md-5 col-lg-5 col-xl-5 mb-3">
                        <h6>
                          <label>Conditions</label>
                        </h6>
                        <ul>
                          {props.rule.conditions.map((currentCondition, index) => {
                            return (
                              <li key={index}>
                                <b>{currentCondition.link + " "}</b>
                                {currentCondition.type +
                                  " is " +
                                  currentCondition.operator +
                                  " " +
                                  currentCondition.value1 +
                                  (currentCondition.value2 === ""
                                    ? ""
                                    : " and " + currentCondition.value2)}
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      <div className="col-sm-12 col-md-7 col-lg-7 col-xl-7 mb-3">
                        <h6>
                          <label>Temporal Conditions</label>
                        </h6>
                        <ul>
                          {props.rule.temporalConditions.map(
                            (currentTemporalCondition, index) => {
                              return (
                                <li key={index}>
                                  <b>{currentTemporalCondition.temporalLink}</b>
                                  {` "` +
                                    currentTemporalCondition.temporalItem +
                                    `" `}
                                  <b>{currentTemporalCondition.temporalOperator}</b>
                                  {` "` +
                                    currentTemporalCondition.temporalValue1 +
                                    `"` +
                                    (currentTemporalCondition.temporalValue2 === ""
                                      ? ""
                                      : ` and "` +
                                      currentTemporalCondition.temporalValue2 +
                                      `"`)}
                                </li>
                              );
                            }
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RulesList = (props) => {
  const deleteRule = (id) => {
    axiosInstance
      .delete("/rules/" + id)
      .then((response) => {
        props.setRules({
          rules: props.rules.rules.filter((el) => el._id !== id),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const rulesList = () => {
    return props.rules.map((currentrule) => {
      return (
        <RuleBigDiv
          rule={currentrule}
          athletes={props.athletes}
          key={currentrule._id}
          delete={deleteRule}
        ></RuleBigDiv>
      );
    });
  };

  return (
    <div>
      <h1 className="d-flex justify-content-between align-center">
        Your Rules
        <Link href={"/addRule"}>
          <button type="button" className="float-right btn btn-outline-primary">
            New rule
          </button>
        </Link>
      </h1>
      {rulesList()}
    </div>
  )
};

export default RulesList;
