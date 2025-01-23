// hash password 
//generate token


exports.convertDurationToHour=function(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
  const totalHoures={
    hours:hours,minutes:minutes,seconds:seconds
  }
    return totalHoures 
  }

  // Helper function to convert ISO 8601 duration to seconds
exports.isoDurationToSeconds=function(isoDuration) {
  const matches = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parseInt(matches[1]) || 0;
  const minutes = parseInt(matches[2]) || 0;
  const seconds = parseInt(matches[3]) || 0;
  return hours * 3600 + minutes * 60 + seconds;
}