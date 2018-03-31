export class FriendManagementModel {
  constructor(
    public userId: number,
    public userName: string,
    public friendshipStatus: FriendshipStatus,
    public isReceived: boolean,
    public thumbnailPath: string
  ) { }  
}

export class FriendManagementViewModel {
  constructor(
    public userId: number,
    public userName: string,
    public friendshipStatus: FriendshipStatus,
    public friendshipStatusList: FriendshipStatusModel[],
    public isReceived: boolean,
    public thumbnailPath: string
  ) { }
}

export class FriendshipStatusModel {
  constructor(
    public friendshipStatus: FriendshipStatus,
    public friendshipStatusText: string,
    public isReadOnly: boolean
  ) { }
}

export enum FriendshipStatus {
  Waiting = 0,
  Accepted = 1,
  Declined = 2  
}

export class SearchTextModel {
  constructor(
    public searchText: string
  ) { }
}

export class FriendshipListViewModel {
  constructor(
    public userId: number,
    public friendId: number,
    public friendshipStatus: FriendshipStatus
  ) { }  
}

export class UserIdModel {
  constructor(
    public userId: number
  ) { }
}
