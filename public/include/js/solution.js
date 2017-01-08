function getTestcases( s ){
	return $.get('/ajax/testcases', {solution_id: s.data('id'), last_tid: s.data('t_id')});
}

function getSolution( s ){
	return $.get('/ajax/solution-status', {solution_id: s.data('id')});
}


function setLabel(s, pos, label){
	var s_id = s.data('id');
	var e = $(label);
	var width = s.data('width');
	e.attr('id', s_id+'-'+pos);

	//todo
	/*
	if(cur_page > s.data('page')){
		s.html('');
		s.data('page', s.data('page') + 1);
	}
	*/

	if($('#'+e.attr('id')).length){
		$('#'+e.attr('id')).attr('class', e.attr('class'));
	}else{
		e.attr('style', 'width: 0%');
		s.append(e);
		setTimeout("$('#" + e.attr('id') + "').attr('style', 'width: " + width + "');", 50);
	}
}

function animateTestcase(s, testcase){
	//++index;
	s.data('index', s.data('index') + 1);
	s.data('t_id', testcase.id);

	var width = s.data('width');

	label='';
	switch(testcase.verdict){
		case 'AC':
			label = '<div class="progress-bar progress-bar-success" style="width: ' + width + '"></div>';
			break;
		case 'WA':
			label = '<div class="progress-bar progress-bar-danger" style="width: ' + width + '"></div>';
			break;
		case 'TLE':
		case 'MLE':
		case 'RE':
			label = '<div class="progress-bar progress-bar-warning" style="width: ' + width + '"></div>';
			break;
		default:
			label = '<div class="progress-bar progress-bar-info" style="width: ' + width +'"></div>';
			break;
	}
	setLabel(s, s.data('index'), label);
	s.data('wait_time', testcase.time_used);
}

function work( s, done){
	$.when(getTestcases(s), getSolution(s)).done(function(testcases, solution){
		ts = testcases[0].testcases;
		st = solution[0].status;

		if(st < 3){
			s.text(TRANS['solution_status_'+st]);
			setTimeout(work.bind(this, s, done), s.data('wait_time'));
			return;
		}

		//is now running
		if(typeof s.data('running') == 'undefined' || s.data('running') == 0){
			s.data('running', 1);
			s.data('width', 100/testcases[0].cnt_testcases + '%');
			s.html('');
			s.attr('class', 'progress');
		}

		if(typeof ts !== 'undefined' && ts.length > 0){
			for(i=0;i<ts.length;++i){
				animateTestcase(s, ts[i]);
			}
		}

		if(s.length == 0){
			return;
		}else if(st == 3){
			setTimeout(work.bind(this, s, done), s.data('wait_time'));
		}else{
			//finish running
			if(s.data('running') == 1){
				s.data('running', 0);
				setTimeout(done.bind(this, s), 300);
			}
			if(typeof s.data('waiting') == 'undefined' || s.data('waiting') == 0){
				s.data('waiting', 1);
			}
		}
	});
}

function animateJudging( s ,done){
	//s.date('id')
	s.data('t_id', 0); //last testcase_id
	s.data('index', -1); //index of current testcase
	s.data('wait_time', 200); //time used by last testcase
	work(s, done);
}

function updatePendings( finish ){
	$.get('/ajax/solutions-judging').done(function(data){
		$.each(data.solutions, function(key, value){
			var id = value.id, td = $('#solution-'+id);
			if(td.length && td.data('waiting') == 1){
				td.data('waiting', 0);
				animateJudging(td, finish);
			}
		});
		setTimeout(updatePendings.bind(this, finish), 500);
	});
}

function fillTable( s ){
	var tr = $('#tr-'+s.data('id')), id=tr.attr('id');
	s.attr('class', '');
	s.text(TRANS['solution_status_4']);
	$.get('/ajax/solution-result', {solution_id: s.data('id')}).done(function(data){
		$('#' + id + ' .solution-score').text(data.score);
		$('#' + id + ' .solution-timeused').text(data.time_used + 'ms');

		var m = new Number(data.memory_used / 1024 / 1024);
		$('#' + id + ' .solution-memoryused').text(m.toFixed(2) + 'MB');

		$('#' + id + ' .solution-judgedat').text(data.judged_at);
	})
}