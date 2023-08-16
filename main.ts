/**
* makecode DS3231 RTC Package.
* Based on DS1307 package from https://github.com/makecode-extensions/DS1307
*/

// enums to choose alarm number etc - these must be outside the namespace!
enum alarmNum {
    A1,
    A2
}

enum mode {
  Minute,
  HourMinute,
  DateHourMinute,
  DayHourMinute
}

enum interruptEnable {
  Enable,
  Disable
}


/**
 * DS3231 block
 */
//% weight=20 color=#b77ff0 icon="\uf017" block="DS3231"
namespace DS3231 {
    let DS3231_I2C_ADDR =     0x68
    let DS3231_REG_SECOND =   0x00
    let DS3231_REG_MINUTE =   0x01
    let DS3231_REG_HOUR =     0x02
    let DS3231_REG_DAY  =     0x03
    let DS3231_REG_DATE =     0x04
    let DS3231_REG_MONTH =    0x05
    let DS3231_REG_YEAR =     0x06
    let DS3231_REG_A1BASE =   0x08
    let DS3231_REG_A2BASE =   0x0b
    let DS3231_REG_CTRL =     0x0e
    let DS3231_REG_STATUS  =  0x0f
    let DS3231_REG_TEMPU  =   0x11
    let DS3231_REG_TEMPL  =   0x12
    
    
    /**
     * set a DS3231 reg
     */
    function setReg(reg: number, dat: number) {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(DS3231_I2C_ADDR, buf);
    }

    /**
     * get a DS3231 reg value
     */
    function regValue(reg: number){
        pins.i2cWriteNumber(DS3231_I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(DS3231_I2C_ADDR, NumberFormat.UInt8BE);
    }

    /**
     * convert Bcd to Dec
     */
    function bcdToDec(bcd: number){
        return (bcd >> 4) * 10 + (bcd % 16);
    }

    /**
     * convert Dec to Bcd
     */
    function decToBcd(dec: number){
        return Math.idiv(dec, 10) * 16 + (dec % 10)
    }


    /**
     * get Year
     */
    //% blockId="DS3231_GET_YEAR" block="年"
    //% weight=99 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function year(){
        return Math.min(bcdToDec(regValue(DS3231_REG_YEAR)), 99) + 2000
    }

    /**
     * get Month
     */
    //% blockId="DS3231_GET_MONTH" block="月"
    //% weight=98 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function month() {
        return Math.max(Math.min(bcdToDec(regValue(DS3231_REG_MONTH)), 12), 1)
    }

    /**
     * get Date
     */
    //% blockId="DS3231_GET_DATE" block="日"
    //% weight=97 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function date() {
        return Math.max(Math.min(bcdToDec(regValue(DS3231_REG_DATE)), 31), 1)
    }


    /**
     * get (Week) Day
     */
    //% blockId="DS3231_GET_DAY" block="星期"
    //% weight=96 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function day(){
        return Math.max(Math.min(bcdToDec(regValue(DS3231_REG_DAY)), 7), 1)
    }


    /**
     * get Hour
     */
    //% blockId="DS3231_GET_HOUR" block="时"
    //% weight=95 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function hour() {
        return Math.min(bcdToDec(regValue(DS3231_REG_HOUR)), 23)
    }


    /**
     * get Minute
     */
    //% blockId="DS3231_GET_MINUTE" block="分"
    //% weight=94 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function minute() {
        return Math.min(bcdToDec(regValue(DS3231_REG_MINUTE)), 59)
    }


    /**
     * get Second
     */
    //% blockId="DS3231_GET_SECOND" block="秒"
    //% weight=93 blockGap=8
    //% parts=DS3231 trackArgs=0
    export function second() {
        return Math.min(bcdToDec(regValue(DS3231_REG_SECOND)), 59)
    }

    /**
     * set Date and Time
     * @param year is the Year  to be set, eg: 2020
     * @param month is the Month  to be set, eg: 2
     * @param date is the Date  to be set, eg: 15
     * @param day is the day (of the week) to be set, eg: 4
     * @param hour is the Hour  to be set, eg: 0
     * @param minute is the Minute to be set, eg: 0
     * @param second is the Second to be set, eg: 0
     */
    //% blockId="DS3231_SET_DATETIME" block="设置 年 %year|月 %month|日 %date|星期 %day|时 %hour|分 %minute|秒 %second"
    //% year.min=2000 year.max=2099
    //% month.min=1   month.max=12
    //% date.min=1    date.max=31
    //% day.min=1     day.max=7
    //% hour.min=0    hour.max=23
    //% minute.min=0  minute.max=59
    //% second.min=0  second.max=59
    //% weight=60 blockGap
    //% parts=DS3231 trackArgs=0
    export function dateTime(year: number, month: number, date: number, day: number, hour: number, minute: number, second: number){
        let buf = pins.createBuffer(8);
        buf[0] = DS3231_REG_SECOND;
        buf[1] = decToBcd(second);
        buf[2] = decToBcd(minute);
        buf[3] = decToBcd(hour);
        buf[4] = decToBcd(day);
        buf[5] = decToBcd(date);
        buf[6] = decToBcd(month);
        buf[7] = decToBcd(year-2000);//bug fix, notified by pull req from mworkfun
        pins.i2cWriteBuffer(DS3231_I2C_ADDR, buf)
    }
}
//
