
export function isToday(date: Date) {
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}






export function isSlotInThePast(slotTime : string) {
    const [slotHour, slotMinutes] = slotTime.split(":").map(Number)

    const now = new Date()
    const currentHour = now.getHours();
    const currenteMinutes = now.getMinutes();


    if (slotHour < currentHour) {
        return true;

    }else if(slotHour === currentHour && slotMinutes <= currenteMinutes){
        return true;
    }

    return false;
}


export function isSlotSequenceAvaliable(
    startSlot: string,
    requiredSlot: number,
    allSlots: string[],
    blockedSlots: string[]
){
    const startIndex = allSlots.indexOf(startSlot)
    if(startIndex === -1 || startIndex + requiredSlot > allSlots.length) {
        return false
    }

    for (let i = startIndex; i < startIndex + requiredSlot; i++){
        const slotTime = allSlots[i]

        if(blockedSlots.includes(slotTime)) {
            return false
        }
    }

    return true;
}