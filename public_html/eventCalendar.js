function dateObj() {
    this.now = new Date();
    this.day = this.now.getDate();
    this.numDay = this.now.getDay();
    this.month = parseInt(this.now.getMonth());
    this.year = this.now.getFullYear();
    var self = this;

//
//function changeDate takes negative or positive number
//to take next or previous month
//
    this.changeDate = function(Arg) {
        var Arg;
        var number = Arg > 0 ? -1 : 1;
        var current = new Date(this.year, this.month + number, 1);
        this.now = current;
        this.numDay = current.getDay();
        this.month = parseInt(current.getMonth())
        this.year = current.getFullYear();
    }

//    
//GetMonth replace number of Mont to Name
//
    this.getNameMonth = function() {
        var month = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
        return month[this.month];
    }
    this.getDaysMonth = function(year, month) {
        if (typeof (month) === 'undefined')
            month = this.month;
        if (typeof (year) === 'undefined')
            year = this.year;

        this.daysInMonth = new Date(year, month + 1, 0).getDate();
        return this.daysInMonth;
    }
    this.getPlainDays = function() {
        var y = this.year;
        var m = this.month;
        var firstDay = new Date(y, m, 1);
        var weekday = new Array(6, 0, 1, 2, 3, 4, 5);
        return weekday[firstDay.getDay()];
    }

//
//mark current day and mark events in current month
//
//
    this.markEvents = function(month, year) {
        var month = this.month + 1;
        var year = this.year;
        var day = this.day;
        var today = this.checkMonth();

        if (today) {
            $('#' + day).addClass('today');
        }

//Mark events in current month

        var matches = Calendar.events.filter(function(val, index, array) {
            return parseInt(val.Month) === month && parseInt(val.Year) === year;
        });
        for (i = 0; i < matches.length; i++) {
            $('#' + matches[i].Day).addClass('event');
        }
    }
//
//Check if month displayed is current month
//set mil sec to 0 to compare dates
//
    this.checkMonth = function() {
        var x = new Date();
        var y = this.now;
        return x.getMonth() === y.getMonth();
    }

//
//Building PlainDays + Days without events
//

    this.buildMonth = function() {
        var numDays = this.getDaysMonth();
        var plainDays = this.getPlainDays();
        var html = '';

        $('#calendarNav li').eq(1).html($.trim(this.getNameMonth() + ' ' + this.year));

        $('#month').append(function() {
            for (var i = -plainDays; i < numDays; i++) {
                if (i <= -1) {
                    html += "<li class='eventCal empty'></li>";
                }
                else {
                    html += "<li id='" + parseInt(i + 1) + "'  class='eventCal'><a href='#'>" + parseInt(i + 1) + "</a></li>";
                }
            }
            return html;
        });
        this.markEvents();
        this.getMonthEvents();
        this.getDayEvents();
    }

//
//
//
    this.sortEvents = function(array, field) {
        var field;

        function mycomparator(a, b) {
            return parseInt(a[field]) - parseInt(b[field]);
        }

        var arr = array.sort(mycomparator);
        return arr;
    }

//
//getMonths events and siplay it on first view
//

    this.getMonthEvents = function() {
        var month = this.month + 1;
        var year = this.year;
        var matches = Calendar.events.filter(function(val, index, array) {
            return parseInt(val.Month) === parseInt(month) && parseInt(val.Year) === parseInt(year);
        });

        var matchLength = matches.length;
        var html = '<ul>';

        matches = this.sortEvents(matches, 'Day');
        if (matches[0]) {
            html += '<li>' + self.getNameMonth() + ' - next events:</li>';
        } else {
            html += '<li>In ' + self.getNameMonth() + ' - there are no events.</li>';
        }
        for (i = 0; i < matchLength; i++) {
            var date = matches[i].Day + '-' + matches[i].Month + '-' + matches[i].Year;
            var hour = matches[i].Hour;
            html += '<li>';
            html += '<time date=' + date + '><em>Date: ' + date + '</em>' + ' ' + '<small>hour: ' + hour + '</small></time>';
            html += '<a href="#" class="eventsToggle">' + matches[i].Title + '</a></li>';
        }
        html += '</ul>';
        $('#Day-events-content').html(html);
    }
    this.monthHeight = function() {
         var t = $('#Day-events-content').position();
//         $('#calendarPage').css('min-height',t.top + 'px');
//        console.log(t.top);
    }
//        
//getDayEvents - we selecting day by click and get Events
//
//get id from list
//and find events by date

    this.getDayEvents = function() {
        var year = this.year;

        $('#month').on("click", ".event", function() {
            var id = $(this).attr('id');
            var matches = Calendar.events.filter(function(val, index, array) {
                return parseInt(val.Day) === parseInt(id) && parseInt(val.Year) === parseInt(year);
            });
            matches = self.sortEvents(matches, 'Hour');
            var matchLength = matches.length;

            $('#Day-events-content').html(function() {
                $('#month li').removeClass("active");
                var html = '<ul>';
                html += '<li>' + self.getNameMonth() + ' ' + id + ' events:</li>';

                for (i = 0; i < matchLength; i++) {
                    var date = matches[i].Day + '-' + matches[i].Month + '-' + matches[i].Year;
                    var hour = matches[i].Hour;
                    html += '<li>';
                    html += '<time date=' + date + '><em>Date: ' + date + '</em>' + ' ' + '<small>hour: ' + hour + '</small></time>';
                    html += '<a href="#" class="eventsToggle">' + matches[i].Title + '</a>';
                    html += '<p class="hidden">' + matches[i].Desc + '</p></li>';
                }
                html += '</ul>';
                $('#' + id).toggleClass("active");
                return html;
            });
        });
    }
//END getDayEvents


//
//Slide Up Events Details
//
//
    this.slideUpComm = function() {
        $("#Day-events-content ul").remove().slideUp("fast");
        $("#Day-events-content h3").remove();
    }



    this.showhideEvents = function() {

        $("#Day-events-content").on("click", ".eventsToggle", function() {
            var elem = $(this).next();
            if (elem.hasClass("hidden")) {
                $("#Day-events-content p").addClass("hidden").slideUp("fast");
                $(elem).removeClass("hidden").slideDown("slow");
            } else {
                $("#Day-events-content p").addClass("hidden").slideUp("fast");
            }
        });
    }

    this.slideCalendar = function() {
        $('#calendartopNav').on("click", ".slide", function() {
            var id = $(this).attr('id');
            var listwidth = $('#month').width();

            self.slideUpComm();
            slideWidth = (id === 'previous') ? listwidth : -listwidth;

            $("#calendarSlider").animate(
                    {
                        "left": slideWidth,
                        "opacity": 1
                    }, 500, function() {
                $("#month li").remove();
            });
            $("#calendarSlider").animate(
                    {
                        "left": 0,
                        "opacity": 100
                    }, 500, function() {
                self.changeDate(slideWidth);
                self.buildMonth();
            });
        });
    }
}
$(document).ready(function() {
    var calendar = new dateObj();
    calendar.buildMonth();
    calendar.monthHeight();
    calendar.showhideEvents();
    calendar.slideCalendar();
});