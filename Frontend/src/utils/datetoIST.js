export default function dateToIST(input) {
    const date = new Date(input);

    // Get IST time offset (IST is UTC+5:30)
    const istOffset = 5 * 60 + 30; // 5 hours and 30 minutes in minutes

    // Convert the Date object to IST
    const istDate = new Date(date.getTime() + istOffset * 60 * 1000);

    const formattedIST = istDate.toLocaleString("en-US", {

        dateStyle: "medium",
    });

    return formattedIST;

}