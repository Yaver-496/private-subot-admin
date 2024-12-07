import { IChannel, IData, IMember } from ".././types";

export function getMockData(): IData {
    let mockData: IData = {
        id: 0,
        channels: [],
        language_code: 'en',
        subscriptionPlans: [],
        username: 'Admin'
    };

    mockData.channels.push(getRandomChannelData());
    mockData.channels.push(getRandomChannelData());
    mockData.channels.push(getRandomChannelData());

    return mockData;
}

export function getRandomChannelData(): IChannel {

    const randomID = getRandomOf(1000000);
    const randomUserCount = getRandomOf(5000);

    let channel: IChannel = {
        id: -randomID,
        inviteLink: 't.me/joinToChann',
        subscribers: [],
        title: `Channel #${randomID}`,
        type: 'channel'
    }

    fillEmptySubscribers(channel, randomUserCount);

    return channel;
}

export function fillEmptySubscribers(channel: IChannel, addCount: number) : string {

    const startIndex = channel.subscribers.length;
    const endIndex = channel.subscribers.length + addCount;

    let newMembers: IMember[] = [];

    for (let index = startIndex; index < endIndex; index++) {

        const expireDate = calculateExpireDate(`${getRandomOf(10)} days`).getTime().toString();
        const randomRole = getRandomRole() as 'admin' | 'subscriber' | 'banned';

        const emptySub: IMember = {
            id: index,
            enddate: expireDate,
            role: randomRole,
            startdate: Date.now().toString(),
            substate: 'active',
            username: `User-#${index}`
        };

        newMembers.push(emptySub);
    }

    const roleCount = newMembers.reduce((count, member) => {
        count[member.role] = (count[member.role] || 0) + 1;
        return count;
    }, { });

    newMembers.forEach(member => channel.subscribers.push(member));
    
    console.log('NEW USERS:', roleCount);

    return JSON.stringify(roleCount);
  }

  const roles = ['admin', 'subscriber', 'banned'];
  const roleWeights = {
      'admin': 0.03,      // 5%
      'subscriber': 0.60, // 60%
      'banned': 0.37      // 35%
  };

  function getWeightOfRole(role: string) : number{
    if(role === 'admin') return roleWeights.admin;
    if(role === 'banned') return roleWeights.banned;

    return roleWeights.subscriber;
  }

  function getRandomRole() {
      const random = Math.random(); // Random number between 0 and 1
      let cumulativeWeight = 0;
  
      for (const role of roles) {
          cumulativeWeight += getWeightOfRole(role); // Add the weight of the current role
          if (random < cumulativeWeight) {
              return role; // Return the role if random falls within the current range
          }
      }
  }

  export function removeEmptySubs(channel: IChannel, removeCount: number) {
    // Ensure removeCount is not greater than the length of the array
    const actualRemoveCount = Math.min(removeCount, channel.subscribers.length);

    // Remove the last `removeCount` subscribers
    channel.subscribers.splice(channel.subscribers.length - actualRemoveCount, actualRemoveCount);
}


  function calculateExpireDate(input: string): Date {
    const [amount, unit] = input.split(" "); // Split input into amount and unit
    const currentDate = new Date(); // Get current date
    const parsedAmount = parseInt(amount, 10); // Convert amount to a number

    if (isNaN(parsedAmount)) {
        throw new Error("Invalid amount. Please provide a number followed by a unit (e.g., '3 months').");
    }

    switch (unit.toLowerCase()) {
        case "day":
        case "days":
            currentDate.setDate(currentDate.getDate() + parsedAmount); // Add days
            break;
        case "month":
        case "months":
            currentDate.setMonth(currentDate.getMonth() + parsedAmount); // Add months
            break;
        default:
            throw new Error("Invalid unit. Supported units are 'days' and 'months'.");
    }

    return currentDate;
}

function getRandomOf(initNum: number) : number {
    return Math.floor(Math.random() * initNum) + 1;
}