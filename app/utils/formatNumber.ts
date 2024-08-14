export const formatNumber = (num: number) => {
    const options = {  maximumFractionDigits: 2   }   
    const formattedNumber = Intl.NumberFormat("en-US",options).format(num); 

    return formattedNumber;
}