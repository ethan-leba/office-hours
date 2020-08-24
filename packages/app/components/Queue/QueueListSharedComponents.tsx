import { ClockCircleOutlined, NotificationOutlined } from "@ant-design/icons";
import React, { ReactElement, ReactNode } from "react";
import styled from "styled-components";
import { useQueue } from "../../hooks/useQueue";
import { formatQueueTime } from "../../utils/TimeUtil";
import { TAStatuses } from "./TAStatuses";
import { Button } from "antd";
import { ButtonProps } from "antd/lib/button";

export const QueuePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const VerticalDivider = styled.div`
  @media (min-width: 767px) {
    border-right: 1px solid #cfd6de;
    margin: 0 32px;
  }
`;

export const QueueContainer = styled.div`
  flex-grow: 1;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const QueueTitle = styled.h2`
  font-weight: 500;
  font-size: 24px;
  color: #212934;
  margin-bottom: 24px;
`;

const TimeText = styled.div`
  font-size: 16px;
  color: #5f6b79;
  margin-left: 12px;
`;

export const NotesText = styled.div`
  font-size: 16px;
  color: #5f6b79;
`;

// New queue styled components start here

const InfoColumnContainer = styled.div`
  flex-shrink: 0;
  @media (min-width: 767px) {
    width: 320px;
  }
`;

const QueueInfoColumnButtonStyle = styled(Button)`
  font-weight: 500;
  font-size: 14px;
  border: 1px solid #cfd6de;
  border-radius: 6px;
  margin-bottom: 16px;
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
`;

const StaffH2 = styled.h2`
  margin-top: 32px;
`;
//TODO: Make QuestionForm self contained so we can trigger it directly in this component and not pass down so many props
interface QueueInfoColumnProps {
  queueId: number;
  buttons: ReactNode;
}

export function QueueInfoColumn({
  queueId,
  buttons,
}: QueueInfoColumnProps): ReactElement {
  const { queue } = useQueue(queueId);
  return (
    <InfoColumnContainer>
      <QueueTitle>{queue?.room}</QueueTitle>
      {queue.startTime && queue.endTime && (
        <QueuePropertyRow>
          <ClockCircleOutlined />
          <QueuePropertyText>{formatQueueTime(queue)}</QueuePropertyText>
        </QueuePropertyRow>
      )}
      {queue?.notes && (
        <QueuePropertyRow>
          <NotificationOutlined />
          <QueuePropertyText>{queue.notes}</QueuePropertyText>
        </QueuePropertyRow>
      )}
      {buttons}
      <StaffH2>Staff</StaffH2>
      <TAStatuses queueId={queueId} />
    </InfoColumnContainer>
  );
}
