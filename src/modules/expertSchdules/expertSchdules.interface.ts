export interface IAssignExpertSchedulePayload {
  scheduleIds: string[];
}

export interface IUpdateExpertSchedulePayload {
  scheduleIds: {
    id: string;
    shouldDelete: boolean;
  }[];
}


