$(document).ready(function() {
    $('#range-control').rangeslider({
        polyfill: false
    })
        .on('input', function() {
            if (this.value == 0) {
                $('#loanAmount').val("0");
            } else {
                $('#loanAmount').val(this.value);
            }
        });

    $('#loanAmount').on('input', function() {
        if (this.value === "") {
            this.value = 0;
        }
        $('#range-control').attr('step', 1);
        $('#range-control').rangeslider('update', true);
        $('#range-control').val(this.value).change();
        $('#range-control').attr('step', 100);
        $('#range-control').rangeslider('update', true);
    });

    $('#range-control1').rangeslider({
        polyfill: false
    })
        .on('input', function() {
            if (this.value == 0) {
                $('#apr').val("0");

            } else {
                $('#apr').val(this.value);
            }
        });
    $('#apr').on('input', function() {
        if (this.value === "") {
            this.value = 0;
        }
        $('#range-control1').val(this.value).change();
    });

    $('#range-control2').rangeslider({
        polyfill: false
    })
        .on('input', function() {
            if (this.value == 0) {
                $('#monthlyPayment').val("0");
            } else {
                $('#monthlyPayment').val(this.value);
            }
        });
    $('#monthlyPayment').on('input', function() {
        if (this.value === "") {
            this.value = 0;
        }
        $('#range-control2').attr('step', 1);
        $('#range-control2').rangeslider('update', true);
        $('#range-control2').val(this.value).change();
        $('#range-control2').attr('step', 100);
        $('#range-control2').rangeslider('update', true);
    });

    $('#range-control3').rangeslider({
        polyfill: false
    })
        .on('input', function() {
            if (this.value == 0) {
                $('#monthsToPayOff').val("0");
            } else {
                $('#monthsToPayOff').val(this.value);
            }
        });
    $('#monthsToPayOff').on('input', function() {
        if (this.value === "") {
            this.value = 0;
        }
        $('#range-control3').val(this.value).change();
    });


    var errorMsg = '';
    var monthlyPaymentOption = false;
    var monthsToPayOption = true;
    var maxAmountOption = false;


    $("#monthlyPayment").prop('disabled', true);
    $("#monthsToPayOff").prop('disabled', false);
    $("#loanAmount").prop('disabled', false);
    $("li").removeClass("calculator-blur");
    $("#monthlyPayment").parent().addClass("calculator-blur");
    $(".payoff-range").removeClass("disabled-slider");
    $(".loan-range").removeClass("disabled-slider");
    $(".apr-range").removeClass("disabled-slider");
    $(".monthly-range").addClass("disabled-slider");


    $('#monthsToPayOffButton').click(function () {
        $("#monthsToPayOff").prop('disabled', true);
        $("#monthlyPayment").prop('disabled', false);
        $("#loanAmount").prop('disabled', false);
        $("li").removeClass("calculator-blur");
        $("#monthsToPayOff").parent().addClass("calculator-blur");
        $(".payoff-range").addClass("disabled-slider");
        $(".monthly-range").removeClass("disabled-slider");
        $(".loan-range").removeClass('disabled-slider');


        monthlyPaymentOption = true;
        monthsToPayOption = false;
        maxAmountOption = false;
    });

    $('#monthlyPaymentButton').click(function () {
        $("#monthlyPayment").prop('disabled', true);
        $("#monthsToPayOff").prop('disabled', false);
        $("#loanAmount").prop('disabled', false);
        $("li").removeClass("calculator-blur");
        $("#monthlyPayment").parent().addClass("calculator-blur");
        $(".payoff-range").removeClass("disabled-slider");
        $(".loan-range").removeClass("disabled-slider");
        $(".apr-range").removeClass("disabled-slider");
        $(".monthly-range").addClass("disabled-slider");


        monthlyPaymentOption = false;
        monthsToPayOption = true;
        maxAmountOption = false;
    });

    $('#maxAmountButton').click(function () {
        $("#monthlyPayment").prop('disabled', false);
        $("#monthsToPayOff").prop('disabled', false);
        $("#loanAmount").prop('disabled', true);
        $("li").removeClass("calculator-blur");
        $("#loanAmount").parent().addClass("calculator-blur");
        $(".loan-range").addClass("disabled-slider");
        $(".payoff-range").removeClass("disabled-slider");
        $(".monthly-range").removeClass("disabled-slider");
        $(".apr-range").removeClass("disabled-slider");


        monthlyPaymentOption = false;
        monthsToPayOption = false;
        maxAmountOption = true;
    });

    $(".calculator input").on('change', function () {
        $(this).val($(this).val().replace(/[^0-9\.]/gi, ""));
    });


    $('.loan-calculator form').on('input', function (e) {
        e.preventDefault();


        var data = {
            loanAmount: Number($('#loanAmount').val()),
            apr: Number($('#apr').val()) / 100,
            monthlyPayment: Number($('#monthlyPayment').val()),
            monthsToPayOff: Number($('#monthsToPayOff').val()),
            maxAmountTotal: Number($('#maxAmountTotal').val()),
        }

        doOutput(data);
        $('.calculator table').show();

    });


    function monthlyPaymentKnown(loanAmount, apr, monthlyPayment) {

        if (!monthlyPaymentOption) {
            return;
        }

        var mpr = apr / 12;
        var monthsToPayOff;

        var infinityCheck = mpr * loanAmount / monthlyPayment;
        var minPayment = (mpr * loanAmount).toFixed(2);

        if (loanAmount === 0) {
            errorMsg = 'Ole hyvÃ¤ ja anna lainasumma';
            return;
        }

        if (infinityCheck >= 1 || monthlyPayment <= 0) {
            errorMsg = 'KuukausierÃ¤ tÃ¤ytyy olla suurempi kuin â‚¬' + minPayment + ' jotta laina voidaan maksaa takaisin';
            return;
        }

        if (apr === 0 && monthlyPayment !== 0) {
            monthsToPayOff = loanAmount / monthlyPayment;
            return monthsToPayOff;
        }

        monthsToPayOff = (-1 * Math.log(1 - mpr * loanAmount / monthlyPayment) / Math.log(1 + mpr));

        if (monthsToPayOff < 1) {
            monthsToPayOff = 1;
        }

        return monthsToPayOff;
    }

    function monthsToPayOffKnown(loanAmount, apr, monthsToPayOff) {

        if (!monthsToPayOption) {
            return;
        }

        var mpr = apr / 12;
        var monthlyPaymentTotal;

        if (loanAmount === 0) {
            errorMsg = 'Ole hyvÃ¤ ja syÃ¶tÃ¤ lainasumma';
            return;
        } else if (monthsToPayOff >= 1200) {
            errorMsg = 'KuukausierÃ¤ tÃ¤ytyy olla pienempi kuin 1200';
            return;
        } else if (monthsToPayOff === 0) {
            errorMsg = 'KuukausierÃ¤ tÃ¤ytyy olla suurempi kuin 0';
            return;
        }

        if (apr === 0) {
            monthlyPaymentTotal = loanAmount / monthsToPayOff;
            return monthlyPaymentTotal;
        }

        monthlyPaymentTotal = (loanAmount * mpr) / (1 - (Math.pow((1 + mpr), -monthsToPayOff)));

        return monthlyPaymentTotal;
    }

    function maxAmountKnown(monthlyPayment, apr, monthsToPayOff) {

        if (!maxAmountOption) {
            return;
        }

        if( $("#apr").val() === '0' ) {
            errorMsg = 'SyÃ¶tÃ¤ korko (nimelliskorko)';
        }

        var mpr = apr / 12;
        var maxAmountTotal;


        if (apr === 0) {
            maxAmountTotal = loanAmount / monthsToPayOff;
            return maxAmountTotal;
        }

        maxAmountTotal = monthlyPayment * (1 - Math.pow(1 + mpr, -monthsToPayOff)) / mpr;

        return maxAmountTotal;
    }

    function doOutput(data) {
        errorMsg = '';
        var totalInterest;
        var monthsToPayOff = monthlyPaymentKnown(data.loanAmount, data.apr, data.monthlyPayment);
        var monthlyPaymentResult = monthsToPayOffKnown(data.loanAmount, data.apr, data.monthsToPayOff);
        var maxAmountResult = maxAmountKnown(data.monthlyPayment, data.apr, data.monthsToPayOff);


        if (errorMsg) {
            $('.calculator #calculator-results').hide();
            // $('#global-error').empty();
           // $('#global-error').append(errorMsg);
            return;
        }

       // $('#global-error').empty();

        $('.calculator #calculator-results').show();

        if (monthlyPaymentOption) {

            totalInterest = Math.abs(monthsToPayOff * data.monthlyPayment - data.loanAmount);

            $('#calculator-results').empty()
                .append(
                    "<tr><td>Maksuaika kuukausina</td><td>" + Math.ceil(monthsToPayOff) + "</td></tr>"
                )
                .append(
                    "<tr><td>Maksuaika vuosina</td><td>" + (monthsToPayOff / 12).toFixed(2) + "</td></tr>"
                )
                .append(
                    "<tr><td>Korkojen osuus</td><td>" + (totalInterest).toFixed(2) + " â‚¬</td></tr>"
                )
                .append(
                    "<tr><td colspan=\"2\" class=\"text-right\"><a href=\"lainahakemus\" class=\"button-main button-main-2 button-main-sm button-main-full\";\">Hae lainaa</a></td></tr>"
                );

        }

        if (monthsToPayOption) {

            totalInterest = Math.abs(data.monthsToPayOff * monthlyPaymentResult - data.loanAmount);

            $('#calculator-results').empty()
                .append(
                    "<tr><td>KuukausierÃ¤</td><td>" + Math.round(monthlyPaymentResult * 100) / 100 + " â‚¬/kk</td></tr>"
                )
                .append(
                    "<tr><td>Korkojen osuus</td><td>" + (totalInterest).toFixed(2) + " â‚¬</td></tr>"
                )
                .append(
                    "<tr><td colspan=\"2\" class=\"text-right\"><a href=\"lainahakemus\" class=\"button-main button-main-2 button-main-sm button-main-full\";\">Hae lainaa</a></td></tr>"
                );
        }

        if (maxAmountOption) {

            totalInterest = Math.abs(monthsToPayOff * data.monthlyPayment - data.loanAmount);

            $('#calculator-results').empty()
                .append(
                    "<tr><td>Lainan enimmÃ¤ismÃ¤Ã¤rÃ¤</td><td>" + maxAmountResult.toFixed(2) + " â‚¬/kk</td></tr>"
                )
                .append(
                    "<tr><td colspan=\"2\" class=\"text-right\"><a href=\"lainahakemus\" class=\"button-main button-main-2 button-main-sm button-main-full\";\">Hae lainaa</a></td></tr>"
                );
        }
    }});
