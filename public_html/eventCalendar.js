function dateObj() {
    this.d = new Date();
    this.day = this.d.getDate();
    this.numDay = this.d.getDay();
    this.month = parseInt(this.d.getMonth());
    this.year = this.d.getFullYear();
    var self = this;

    this.getDaysMonth = function(year, month) {
        if (typeof (month) === 'undefined')
            month = this.month;
        if (typeof (year) === 'undefined')
            year = this.year;

        this.daysInMonth = new Date(year, month + 1, 0).getDate();
        return this.daysInMonth;
    }
    this.getPlainDays = function() {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1);
        weekday = new Array(6, 5, 4, 3, 2, 1);
        return weekday[firstDay.getDay()];
    }
    this.markEvents = function(month, year) {
        month = this.month + 1;
        year = this.year;
        var matches = Calendar.events.filter(function(val, index, array) {
            return parseInt(val.Month) === month && parseInt(val.Year) === year;
        });
        for (i = 0; i < matches.length; i++) {
            $('#' + matches[i].Day).addClass('event');
        }
    }

    this.buildMonth = function() {
        var numDays = this.getDaysMonth();
        var plainDays = this.getPlainDays();
        var html = '';

//
//Building PlainDays + Days without events
//
        $('#month').append(function() {
            for (var i = -plainDays; i < numDays; i++) {
                if (i <= -1) {
                    html += "<li class='eventCal empty'></li>";
                } else {
                    html += "<li id='" + parseInt(i + 1) + "'  class='eventCal'><a href='#'>" + parseInt(i + 1) + "</a></li>";
                }
            }
            return html;
        });
    }
//        
//GetEvents - we selecting day by click and get Events
//
//get id from list
//and find events by date

    this.getEvents = function() {
        var year = this.year;

        $('#month').on("click", ".event", function() {
            
            var id = $(this).attr('id');
            var matches = Calendar.events.filter(function(val, index, array) {
                return parseInt(val.Day) === parseInt(id) && parseInt(val.Year) === parseInt(year);
            });
            var matchLength = matches.length;

            $('#Day-events-content').html(function() {
                $('#month li').removeClass("active");
                var html = '<ul>';
                for (i = 0; i < matchLength; i++) {
                    var date = matches[i].Day + '-' + matches[i].Month + '-' + matches[i].Year;
                    var hour = matches[i].Hour;
                    html += '<li>';
                    html += '<time date=' + date + '><em>' + date + '</em><small>' + hour + '</small></time>';
                    html += '<a href="#" class="eventsToggle">' + matches[i].Title + '</a>';
                    html += '<p class="hidden">' + matches[i].Desc + '</p></li>';
                }
                html += '</ul>';
                $('#' + id).toggleClass("active");
                return html;
            });
        });

//END Get Events
    }
    this.slideUpComm = function() {
        $("#Day-events-content p").addClass("hidden").slideUp("fast");
    }
    this.showhideEvents = function() {

        $("#Day-events-content").on("click", ".eventsToggle", function() {
            var elem = $(this).next();
            if (elem.hasClass("hidden")) {
                self.slideUpComm();
                $(elem).removeClass("hidden").slideDown("slow");
            } else {
                self.slideUpComm();
            }
        });
    }

    this.slideCalendar = function() {
        $('#calendarSlider').on("click", ".slide", function() {
            var id = $(this).attr('id');
            var listwidth = $('#month').width();

            self.slideUpComm();
            slideWidth = (id === 'previous') ? listwidth : -listwidth;

            $("#month").animate(
                    {
                        "left": slideWidth,
                        "opacity": 1
                    }, 500, function() {
                $("#month li").remove();
                $("#Day-events-content").remove();
            });

        });
    }
}
$(document).ready(function() {
    var calendar = new dateObj();
    calendar.buildMonth();
    calendar.markEvents();
    calendar.getEvents();
    calendar.showhideEvents();
    calendar.slideCalendar();
});