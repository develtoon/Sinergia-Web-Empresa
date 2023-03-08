(function () {
    const { Icon } = Global
    // T I M E S T A M P - U T I L S
    const INTL_DATE_FORMAT_DEFAULT_OPTION = { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }
    const initArray = count => new Array(count).fill()

    const timezoneOffset = timeZone => {
        const now = new Date()
        const utc = new Intl.DateTimeFormat('en-US', { ...INTL_DATE_FORMAT_DEFAULT_OPTION, timeZone: 'UTC' }).format(now)
        const current = new Intl.DateTimeFormat('en-US', { ...INTL_DATE_FORMAT_DEFAULT_OPTION, timeZone }).format(now)
        return new Date(current).getTime() - new Date(utc).getTime()
    }

    const SECOND_IN_MILLISECONDS = 1000
    const MINUTE_IN_MILLISECONDS = SECOND_IN_MILLISECONDS * 60
    const HOUR_IN_MILLISECONDS = MINUTE_IN_MILLISECONDS * 60
    const DAY_IN_MILLISECONDS = HOUR_IN_MILLISECONDS * 24
    const ISO_STRING_REGEXP = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})+/

    const tu = () => ({
        timezone: 'UTC',

        timezoneDiff: 0,

        setTimezone(timezone) {
        this.timezoneDiff = timezoneOffset(timezone)
        this.timezone = timezone
        },

        // 0: Year, 1: Month, 2: Day, 3: Hours, 4: Minutes, 5: Seconds, 6: Milliseconds
        decompose(timestamp, timezone = this.timezone) {
        const timestampDiff = timezone === this.timezone ? this.timezoneDiff : timezoneOffset(timezone)
        return new Date(timestamp + timestampDiff).toISOString().match(ISO_STRING_REGEXP).slice(1)
        },

        addOneMonth(timestamp, negative) {
        const day = this.getDay(timestamp)
        const multiplicator = negative ? -1 : 1

        // Find the closest day
        // 28, 29, 30 and 31 are all months length possibility
        const { value } = [28, 29, 30, 31].reduce((prev, value) => {
            const diff = Math.abs(parseInt(this.getDay(this.addDays(timestamp, value * multiplicator)), 10) - day)
            return (prev.diff === null || diff < prev.diff) ? { value, diff } : prev
        }, { value: null, diff: null })

        return this.addDays(timestamp, value * multiplicator)
        },

        getYear(timestamp, timezone) {
        return this.decompose(timestamp, timezone)[0]
        },

        getMonth(timestamp, timezone) {
        return this.decompose(timestamp, timezone)[1]
        },

        // Split timestamp into days. +3 is beacause 01 January 1970 is a Thursday
        getWeekDay(timestamp) {
        return ((Math.floor((timestamp + this.timezoneDiff) / DAY_IN_MILLISECONDS) % 7) + 3) % 7
        },

        getDay(timestamp, timezone) {
        return this.decompose(timestamp, timezone)[2]
        },

        getHours(timestamp, timezone) {
        return this.decompose(timestamp, timezone)[3]
        },

        getMinutes(timestamp, timezone) {
        return this.decompose(timestamp, timezone)[4]
        },

        getSeconds(timestamp, timezone) {
        return this.decompose(timestamp, timezone)[5]
        },

        getMilliseconds(timestamp, timezone) {
        return this.decompose(timestamp, timezone)[6]
        },

        addMonths(timestamp, months) {
        return initArray(Math.abs(months)).reduce(prev => this.addOneMonth(prev, months < 0), timestamp)
        },

        addYears(timestamp, years) {
        return initArray(Math.abs(years)).reduce(prev => this.addMonths(prev, years > 0 ? 12 : -12), timestamp)
        },

        addDays(timestamp, days) {
        return timestamp + (DAY_IN_MILLISECONDS * days)
        },

        addHours(timestamp, hours) {
        return timestamp + (HOUR_IN_MILLISECONDS * hours)
        },

        addMinutes(timestamp, minutes) {
        return timestamp + (MINUTE_IN_MILLISECONDS * minutes)
        },

        addSeconds(timestamp, seconds) {
        return timestamp + (SECOND_IN_MILLISECONDS * seconds)
        },

        addMilliseconds(timestamp, milliseconds) {
        return timestamp + milliseconds
        },

        add(timestamp, { years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0 }) {
        return this.addYears(this.addMonths(this.addDays(this.addHours(this.addMinutes(this.addSeconds(this.addMilliseconds(timestamp, milliseconds), seconds), minutes), hours), days), months), years)
        },

        setYear(timestamp, year) {
        return this.addYears(timestamp, year - this.getYear(timestamp))
        },

        setMonth(timestamp, month) {
        return this.addMonths(timestamp, month - this.getMonth(timestamp))
        },

        setWeekDay(timestamp, weekDay) {
        return this.addDays(timestamp, weekDay - this.getWeekDay(timestamp))
        },

        setDay(timestamp, day) {
        return this.addDays(timestamp, day - this.getDay(timestamp))
        },

        setHours(timestamp, hours) {
        return this.addHours(timestamp, hours - this.getHours(timestamp))
        },

        setMinutes(timestamp, minutes) {
        return this.addMinutes(timestamp, minutes - this.getMinutes(timestamp))
        },

        setSeconds(timestamp, seconds) {
        return this.addSeconds(timestamp, seconds - this.getSeconds(timestamp))
        },

        setMilliseconds(timestamp, milliseconds) {
        return this.addMilliseconds(timestamp, milliseconds - this.getMilliseconds(timestamp))
        },

        set(timestamp, { year, month, day, hours, minutes, seconds, milliseconds }) {
        const y = year || this.getYear(timestamp)
        const m = month || this.getMonth(timestamp)
        const d = day || this.getDay(timestamp)
        const h = hours || this.getHours(timestamp)
        const mn = minutes || this.getMinutes(timestamp)
        const s = seconds || this.getSeconds(timestamp)
        const ms = milliseconds || this.getMilliseconds(timestamp)
        return this.setYear(this.setMonth(this.setDay(this.setHours(this.setMinutes(this.setSeconds(this.setMilliseconds(timestamp, ms), s), mn), h), d), m), y)
        }
    })
    const t = tu()
    // E N D  T I M E S T A M P - U T I L S

    // L O D A S H. T I M E S
    const MAX_SAFE_INTEGER = 9007199254740991
    const MAX_ARRAY_LENGTH = 4294967295

    function times(n, iteratee) {
        if (n < 1 || n > MAX_SAFE_INTEGER) {
            return []
        }
        let index = -1
        const length = Math.min(n, MAX_ARRAY_LENGTH)
        const result = new Array(length)
        while (++index < length) {
            result[index] = iteratee(index)
        }
        index = MAX_ARRAY_LENGTH
        n -= MAX_ARRAY_LENGTH
        while (++index < n) {
            iteratee(index)
        }
        return result
    }
    // E N D L O D A S H. T I M E S


    const MONTHS_LENGHT = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    const isLeapYear = year => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

    const initMonth = timestamp => {
        timestamp = timestamp || new Date().getTime()
        const [year, month, dayNumber] = t.decompose(timestamp)
        const firstMonthDay = getDateWithoutTime(t.addDays(timestamp, -dayNumber + 1))
        const monthLenght = MONTHS_LENGHT[month - 1] || (isLeapYear(year) ? 29 : 28)
        const lastMonthDay = t.addDays(firstMonthDay, monthLenght - 1)
        const firstMonthDayNumber = t.getWeekDay(firstMonthDay)
        const firstDayToDisplay = t.addDays(firstMonthDay, -firstMonthDayNumber)

        return {
            firstMonthDay,
            lastMonthDay,
            firstDayToDisplay,
            month,
            year
        }
    }

    const parseRange = (startDate, endDate) => ({
        startDate: endDate ? startDate ? Math.min(startDate, endDate) : null : startDate,
        endDate: endDate && (endDate !== startDate) ? Math.max(startDate, endDate) : null
    })

    const getDays = (firstDay, lastDay) => {
        const lastDayNumber = t.getWeekDay(lastDay)
        const nextMonthDaysCount = lastDayNumber === 6 ? 0 : (6 - lastDayNumber)
        const daysCount = ((lastDay - firstDay) / DAY_IN_MILLISECONDS) + nextMonthDaysCount + 1
        return times(daysCount, i => t.addDays(firstDay, i))
    }

    const getDateWithoutTime = timestamp => {
        const [, , , hours, minutes, seconds, milliseconds] = t.decompose(timestamp)
        return t.add(timestamp, { hours: -hours, minutes: -minutes, seconds: -seconds, milliseconds: -milliseconds })
    }

    const dateIsBetween = (date, start, end) => date > start && date < end

    const dateIsOut = (date, start, end) => date < start || date > end

    const formartTime = value => (`0${value}`).slice(-2)

    const { number, func, bool, arrayOf, string, oneOfType } = PropTypes
    const { Component, useState, forwardRef } = React

    class DateDetails extends Component {
        onHoursChange = e => {
            const { date, onTimeChange } = this.props
            onTimeChange(t.setHours(date, parseInt(e.target.value, 10)))
        }

        onMinutesChange = e => {
            const { date, onTimeChange } = this.props
            onTimeChange(t.setMinutes(date, parseInt(e.target.value, 10)))
        }

        render = () => {
            const { date, displayTime, dayLabels, monthLabels } = this.props
            const hours = t.getHours(date)
            const minutes = t.getMinutes(date)

            return (
                <div className="rlc-date-details-wrapper">
                    <div className="rlc-date-details">
                        <div className="rlc-date-number">{t.getDay(date)}</div>
                        <div className="rlc-date-day-month-year">
                            <div className="rlc-detail-day">{dayLabels[t.getWeekDay(date)]}</div>
                            <div className="rlc-detail-month-year">{monthLabels[t.getMonth(date) - 1]} <span className="rlc-detail-year">{t.getYear(date)}</span></div>
                        </div>
                    </div>
                    {displayTime &&
                    <div className="rlc-date-time-selects">
                        <select onChange={this.onHoursChange} value={hours}>{times(24).map(hour => <option value={formartTime(hour)} key={hour}>{formartTime(hour)}</option>)}</select>
                        <span className="rlc-time-separator">:</span>
                        <select onChange={this.onMinutesChange} value={minutes}>{times(60).map(minute => <option value={formartTime(minute)} key={minute}>{formartTime(minute)}</option>)}</select>
                    </div>
                    }
                </div>
            )
        }
    }

    DateDetails.propTypes = {
        date: number,
        displayTime: bool,
        dayLabels: arrayOf(string),
        monthLabels: arrayOf(string),
        onTimeChange: func
    }

    class Navigation extends Component {
        prevYear = () => this.props.onChange({ yearOffset: -1 })
        prevMonth = () => this.props.onChange({ monthOffset: -1 })

        nextYear = () => this.props.onChange({ yearOffset: 1 })
        nextMonth = () => this.props.onChange({ monthOffset: 1 })

        render = () => {
            const { monthLabels, month, year } = this.props
            return (
                <div className="rlc-month-and-year-wrapper">
                    <div className="rlc-navigation-button-wrapper rlc-prevs">
                        <div className="rlc-navigation-button rlc-prev-year" onClick={this.prevYear}>{'<<'}</div>
                        <div className="rlc-navigation-button rlc-prev-month" onClick={this.prevMonth}>{'<'}</div>
                    </div>
                    <div className="rlc-month-and-year">{monthLabels[month - 1]} <span>{year}</span></div>
                    <div className="rlc-navigation-button-wrapper rlc-nexts">
                        <div className="rlc-navigation-button rlc-next-month" onClick={this.nextMonth}>{'>'}</div>
                        <div className="rlc-navigation-button rlc-next-year" onClick={this.nextYear}>{'>>'}</div>
                    </div>
                </div>
            )
        }
    }

    Navigation.propTypes = {
        monthLabels: arrayOf(string),
        month: string,
        year: string,
        onChange: func
    }

    class Calendar extends Component {
        constructor (props) {
            super(props)
            t.setTimezone(props.timezone)
            this.state = this.getInitialState(props)
        }

        componentDidUpdate = prevProps => {
            const { timezone, startDate, endDate } = this.props
            if (timezone !== prevProps.timezone) t.setTimezone(timezone)
            if (startDate !== prevProps.startDate || endDate !== prevProps.endDate)
                this.setState(this.getInitialState(this.props))
        }

        getInitialState = ({ startDate, endDate }) => ({
            ...initMonth(startDate),
            ...parseRange(startDate, endDate)
        })

        onClickDay = day => {
            const { startDate, endDate } = this.state
            if (!startDate) this.update({ startDate: day })
            else if (startDate && !endDate) this.update(parseRange(startDate, day))
            else this.update({ startDate: day, endDate: null })
        }

        changeMonth = ({ yearOffset = 0, monthOffset = 0 }) => {
            const { firstMonthDay } = this.state
            const timestamp = t.add(firstMonthDay, { months: monthOffset, years: yearOffset })
            this.setState(initMonth(timestamp))
        }

        update = ({ startDate, endDate }) => {
            const sDate = startDate === undefined ? this.props.startDate : startDate
            const eDate = endDate === undefined ? this.props.endDate : endDate
            this.props.onChange(sDate, eDate)
        }

        getClassNames = day => {
            const { firstMonthDay, lastMonthDay, startDate, endDate } = this.state
            const { disableDates, markedDays } = this.props
            const sDate = getDateWithoutTime(startDate)
            const eDate = getDateWithoutTime(endDate)
            const isMarked = typeof markedDays === 'function'
                ? markedDays(day)
                : Array.isArray(markedDays)
                ? markedDays.map(getDateWithoutTime).includes(day)
                : false

            const conditions = {
                'rlc-day-disabled': disableDates(day),
                'rlc-day-today': day === getDateWithoutTime(new Date().getTime()),
                'rlc-day-inside-selection': dateIsBetween(day, sDate, eDate),
                'rlc-day-out-of-month': dateIsOut(day, firstMonthDay, lastMonthDay),
                'rlc-day-selected': !endDate && (sDate === day),
                'rlc-day-start-selection': endDate && (sDate === day),
                'rlc-day-end-selection': endDate && (eDate === day),
                [`rlc-day-${day}`]: true,
                'rlc-day-marked': isMarked
            }

            return Object.entries(conditions)
                .reduce((prev, [className, valid]) => valid ? `${prev} ${className}` : prev, '')
            }

        render = () => {
            const { firstDayToDisplay, startDate: sDate, endDate: eDate, month, year, lastMonthDay } = this.state
            const { disableDates, displayTime, dayLabels, monthLabels, onClickDate, showDetail } = this.props

            return (
                <div className={ 'c-calendar rlc-calendar ' + this.props.dir }>
                    {
                        showDetail
                        &&
                        <div className="rlc-details" >
                            {!!sDate &&
                                <DateDetails
                                    dayLabels={dayLabels}
                                    monthLabels={monthLabels}
                                    date={sDate}
                                    displayTime={displayTime}
                                    onTimeChange={date => this.update({ startDate: date })}
                                />
                            }
                            {!!eDate &&
                            <DateDetails
                                dayLabels={dayLabels}
                                monthLabels={monthLabels}
                                date={eDate}
                                displayTime={displayTime}
                                onTimeChange={date => this.update({ endDate: date })}
                            />
                            }
                        </div>
                    }
                    <Navigation
                        monthLabels={monthLabels}
                        month={month}
                        year={year}
                        onChange={this.changeMonth}
                    />
                    <div className="rlc-days-label">
                        {dayLabels.map(label => <div className="rlc-day-label" key={label.toLowerCase()}>{label.slice(0, 2)}</div>)}
                    </div>
                    <div className="rlc-days">
                        {getDays(firstDayToDisplay, lastMonthDay).map(day =>
                        <div
                            className={`rlc-day ${this.getClassNames(day)}`}
                            key={day}
                            onClick={() => {
                            onClickDate(day)
                            !disableDates(day) && this.onClickDay(day)
                            }}
                        >
                            {parseInt(t.getDay(day), 10)}
                        </div>
                        )}
                    </div>
                </div>
            )
        }
    }

    Calendar.defaultProps = {
        startDate: null,
        endDate: null,
        onChange: () => {},
        showDetail: false,
        disableDates: () => false,
        displayTime: false,
        dayLabels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        monthLabels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        timezone: 'UTC',
        markedDays: () => false,
        onClickDate: () => {},
        dir: ''
    }

    Calendar.propTypes = {
        startDate: number,
        endDate: number,
        onChange: func,
        showDetail: bool,
        disableDates: func,
        displayTime: bool,
        dayLabels: arrayOf(string),
        monthLabels: arrayOf(string),
        timezone: string,
        markedDays: oneOfType([arrayOf(number), func]),
        onClickDate: func,
        dir: string.isRequired
    }

    const cumulativeOffset = function (element) {
        var top = 0, left = 0;
        do {
            top += element.offsetTop || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);
        return {
            top: top,
            left: left
        };
    }


    const InputCalendar = forwardRef((props, ref) => {
        const [isOpen, setIsOpen] = useState('')
        const open = e => {
            if(props.disabled) return
            setIsOpen(cumulativeOffset(e.target).top >= 380 ? 'top' : 'bottom')
        }
        const close = e => {
            !e.currentTarget.contains(window.document.activeElement) && setIsOpen('')
        }
        const sDecompose = t.decompose(props.startDate)
        const sDate = `${sDecompose[2]}/${sDecompose[1]}/${sDecompose[0]}`
        return (
            <div className="c-input c-input-calendar" tabIndex={0} onFocus={open} onBlur={close}>
                {
                    props.label ? <label className="c-input__label u-text--regular u-text--gray-90" htmlFor={props.id}>{props.label}</label> : ''
                }
                <div className="c-input__cont-input ">
                    <input
                        className="c-input__input"
                        type='text'
                        readOnly
                        ref={ref}
                        name={props.name}
                        value={sDate}
                        placeholder={props.placeholder}
                        disabled={props.disabled}
                    />
                    {isOpen && <Calendar dir={ isOpen } {...props} />}
                    <Icon className="c-input__icon left u-text--skyblue" h="24">calendar_today</Icon>
                </div>
                {
                    props.error && <div className="invalid-feedback">
                        {props.error}
                    </div>
                }
            </div>
        )
    })

    window.InputCalendar = InputCalendar
    window.Calendar = Calendar
})()
