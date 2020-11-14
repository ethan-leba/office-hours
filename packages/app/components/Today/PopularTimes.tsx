import {
  ClockCircleOutlined,
  DownOutlined,
  HourglassOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Heatmap } from "@koh/common";
import { Dropdown, Menu } from "antd";
import { chunk, sum, uniq, range } from "lodash";
import React, { ReactElement, useState } from "react";
import styled from "styled-components";
import { formatDateHour, formatWaitTime } from "../../utils/TimeUtil";
import TimeGraph from "./TimeGraph";

// TODO:
// - Case to handle: No office hours in a week? Right now heatmap is full of nulls, we cant graph nulls
// right now the day ranking includes days with no office hours at all i believe, we want to filter out days with no wait times

const TitleRow = styled.div`
  display: flex;
  align-items: baseline;
`;

interface HeatmapProps {
  heatmap: Heatmap;
}

const WeekdayDropdown = styled.h2`
  display: flex;
  align-items: center;
  margin-left: 8px;
  color: #1890ff;
  cursor: pointer;
`;

const GraphWithArrow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const GraphArrowButtons = styled.div`
  padding: 20px 10px;
  font-size: 1.5em;
  cursor: pointer;
`;

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function findWeekMinAndMax(days: Heatmap) {
  let minHourInWeek = 24;
  let maxHourInWeek = 0;
  days.forEach((v, hour) => {
    if (v) {
      if (hour % 24 > maxHourInWeek) {
        maxHourInWeek = hour % 24;
      } else if (hour % 24 < minHourInWeek) {
        minHourInWeek = hour % 24;
      }
    }
  });
  return [minHourInWeek, maxHourInWeek];
}

const GraphNotes = styled.h4`
  font-size: 14px;
  color: #111;
  padding-left: 40px;
`;

const BUSY = {
  shortest: "the shortest",
  shorter: "shorter than usual",
  avg: "average",
  longer: "longer than usual",
  longest: "the longest",
};

// Mapping for text describing level of business, given the length of the unique wait times that week (to account for days without hours)
const BUSY_TEXTS: string[][] = range(1, 8).map((len) => {
  const arr = [];
  if (len % 2 == 1) {
    arr.push(BUSY.avg);
  }
  if (len > 1) {
    arr.unshift(BUSY.shortest); // add to front
    arr.push(BUSY.longest);
  }
  const usual_texts = Math.floor((len - 2) / 2);
  for (let i = 0; i < usual_texts; i++) {
    arr.splice(1, 0, BUSY.shorter);
    arr.splice(arr.length - 1, 0, BUSY.longer);
  }
  return arr;
});

// {
//   1: ['average'],
//   2: ['the shortest', 'the longest'],
//   3: ['the shortest', 'average', 'the longest'],
//   4: ['the shortest', 'shorter than usual', 'longer than usual', 'the longest'],
//   5: ['the shortest', 'shorter than usual', 'average', 'longer than usual', 'the longest'],
//   6: ['the shortest', 'shorter than usual',  'shorter than usual', 'longer than usual', 'longer than usual', 'the longest'],
//   7: ['the shortest', 'shorter than usual', 'shorter than usual',  'average', 'longer than usual', 'longer than usual', 'the longest'],
// }

function generateBusyText(
  day: number,
  heatmap: Heatmap,
  dailySumWaitTimes: number[]
): string {
  const dayWaitTime = dailySumWaitTimes[day];
  const uniqSumWaitTimes = uniq(
    dailySumWaitTimes.filter((v) => v > 0).sort((a, b) => a - b)
  );
  const rank = uniqSumWaitTimes.indexOf(dayWaitTime);
  console.log(uniqSumWaitTimes.length);
  return BUSY_TEXTS[uniqSumWaitTimes.length - 1][rank];
}

export default function PopularTimes({ heatmap }: HeatmapProps): ReactElement {
  const [currentDayOfWeek, setCurrentDayOfWeek] = useState(new Date().getDay());
  const [firstHour, lastHour] = findWeekMinAndMax(heatmap);
  const dailySumWaitTimes: number[] = chunk(heatmap, 24).map(sum);
  return (
    <div>
      <TitleRow>
        <h2>Wait Times on</h2>
        <Dropdown
          trigger={["click"]}
          overlay={
            <Menu>
              {DAYS_OF_WEEK.map((dayName, i) => (
                <Menu.Item key={dayName}>
                  <a onClick={() => setCurrentDayOfWeek(i)}>{dayName}</a>
                </Menu.Item>
              ))}
            </Menu>
          }
        >
          <WeekdayDropdown>
            {DAYS_OF_WEEK[currentDayOfWeek]}
            <DownOutlined />
          </WeekdayDropdown>
        </Dropdown>
      </TitleRow>
      <GraphWithArrow>
        <GraphArrowButtons
          onClick={() => setCurrentDayOfWeek((7 + currentDayOfWeek - 1) % 7)}
        >
          <LeftOutlined />
        </GraphArrowButtons>
        <TimeGraph
          values={heatmap
            .slice(currentDayOfWeek * 24, (currentDayOfWeek + 1) * 24 - 1)
            .map((i) => (i < 0 ? 0 : i))}
          maxTime={Math.max(...heatmap)}
          firstHour={firstHour}
          lastHour={lastHour}
          width={500}
          height={200}
        />
        <GraphArrowButtons
          onClick={() => setCurrentDayOfWeek((currentDayOfWeek + 1) % 7)}
        >
          <RightOutlined />
        </GraphArrowButtons>
      </GraphWithArrow>
      {dailySumWaitTimes[currentDayOfWeek] > 0 && (
        <GraphNotes>
          <ClockCircleOutlined /> {DAYS_OF_WEEK[currentDayOfWeek]}s have{" "}
          <strong>
            {generateBusyText(currentDayOfWeek, heatmap, dailySumWaitTimes)}
          </strong>{" "}
          wait times.
        </GraphNotes>
      )}
      {heatmap[currentDayOfWeek * 24 + new Date().getHours()] > 0 && (
        <GraphNotes>
          <HourglassOutlined /> At {formatDateHour(new Date())}, people
          generally wait{" "}
          <strong>
            {formatWaitTime(
              heatmap[currentDayOfWeek * 24 + new Date().getHours()]
            )}
          </strong>
          .
        </GraphNotes>
      )}
    </div>
  );
}
