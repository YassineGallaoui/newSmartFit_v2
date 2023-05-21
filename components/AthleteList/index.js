import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const AthleteRow = (props) => (
    <tr>
        <td>
            <Link href={"/athleteDetails?athleteId=" + props.athlete._id} className="h5 text-decoration-none">
                {props.athlete.name}
            </Link>
        </td>
    </tr>
)

const AthletesList = (props) => {
    const athletesList = () => {
        return props.athletes.map(currentathlete => {
            return <AthleteRow athlete={currentathlete} key={currentathlete._id}></AthleteRow>;
        })
    }

    return (
        <div>
            <h1 className="float-left">Your Athletes</h1>
            <table className="table mt-4">
                <tbody>
                    {props.athletes != null && athletesList()}
                </tbody>
            </table>
        </div>
    )
}

export default AthletesList