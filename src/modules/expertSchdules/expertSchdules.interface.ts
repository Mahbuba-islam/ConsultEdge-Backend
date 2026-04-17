export interface IAssignExpertSchedulePayload {
  scheduleIds: string[];
}

export interface IUpdateExpertSchedulePayload {
  scheduleIds: {
    id: string;
    shouldDelete: boolean;
  }[];
}

export interface IPublishExpertSchedulePayload {
  scheduleIds: string[];
  isPublished: boolean;
}


