import {
  ClockCircleOutlined,
  NotificationOutlined,
  StopOutlined,
  CloudSyncOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import React, { ReactElement, ReactNode } from "react";
import styled from "styled-components";
import { useQueue } from "../../hooks/useQueue";
import { formatQueueTime } from "../../utils/TimeUtil";
import { TAStatuses } from "./TAStatuses";
import { Button, Tooltip } from "antd";
import { ButtonProps } from "antd/lib/button";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const QueueTitle = styled.div`
  font-weight: 500;
  font-size: 24px;
  color: #212934;
`;

export const NotesText = styled.div`
  font-size: 16px;
  color: #5f6b79;
`;

// New queue styled components start here

const InfoColumnContainer = styled.div`
  flex-shrink: 0;
  padding-bottom: 30px;
  @media (min-width: 650px) {
    margin-top: 32px;
    width: 290px;
  }
`;

const QueueInfoColumnButtonStyle = styled(Button)`
  font-weight: 500;
  font-size: 14px;
  border: 1px solid #cfd6de;
  border-radius: 6px;
  margin-bottom: 12px;
`;

export const QueueInfoColumnButton = (props: ButtonProps): ReactElement => (
  <QueueInfoColumnButtonStyle size="large" block {...props} />
);

const QueuePropertyRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center; // This kinda funky, not sure how to align the tops of the row
  margin-bottom: 20px;
  color: #5f6b79;
  font-size: 20px;
`;

const QueuePropertyText = styled.div`
  margin-left: 12px;
  font-size: 16px;

  // To break text in flexbox
  min-width: 0;
  overflow-wrap: break-word;
`;

const StaffH2 = styled.h2`
  margin-top: 32px;
`;

const QueueRoomGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
`;
interface QueueInfoColumnProps {
  queueId: number;
  buttons: ReactNode;
}

export function QueueInfoColumn({
  queueId,
  buttons,
}: QueueInfoColumnProps): ReactElement {
  const { queue, isQueueLive } = useQueue(queueId);
  return (
    <InfoColumnContainer>
      <QueueRoomGroup>
        <QueueTitle>{queue?.room}</QueueTitle>
        {!queue.allowQuestions && (
          <Tooltip title="This queue is no longer accepting questions">
            <StopOutlined
              data-cy="stopQuestions"
              style={{ color: "red", fontSize: "24px", marginLeft: "8px" }}
            />
          </Tooltip>
        )}
      </QueueRoomGroup>

      {queue.startTime && queue.endTime && (
        <QueuePropertyRow>
          <ClockCircleOutlined />
          <QueuePropertyText className={"hide-in-percy"}>
            {formatQueueTime(queue)}
          </QueuePropertyText>
        </QueuePropertyRow>
      )}
      {queue?.notes && (
        <QueuePropertyRow>
          <NotificationOutlined />
          <QueuePropertyText>{queue.notes}</QueuePropertyText>
        </QueuePropertyRow>
      )}
      <QueuePropertyRow>
        {isQueueLive ? <CloudSyncOutlined /> : <FrownOutlined />}
        <QueuePropertyText>
          {isQueueLive ? "Queue up to date" : "Queue out of date"}
        </QueuePropertyText>
      </QueuePropertyRow>
      {buttons}
      <StaffH2>Staff</StaffH2>
      <TAStatuses queueId={queueId} />
    </InfoColumnContainer>
  );
}
