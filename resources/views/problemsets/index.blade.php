@extends ('layouts.master')

@section ('title')
{{trans('wzoj.problemsets')}}
@endsection

@section ('content')
<div class='col-xs-12'>

@can ('create',App\Problemset::class)
<form method='POST'>
    {{csrf_field()}}
    <button type="submit" class="btn btn-default">+</button>
</form>
@endcan

<table class="table table-striped">
<thead>
    <tr>
    	<th style="width:5%">{{trans('wzoj.id')}}</th>
	<th>{{trans('wzoj.name')}}</th>
    </tr>
</thead>
@foreach ($problemsets as $problemset)
    <tr>
    	<td>{{$problemset->id}}</td>
	<td>
	    <a href='/s/{{$problemset->id}}'> {{$problemset->name}} </a>
	    @can ('update',$problemset)
	    <a href='/s/{{$problemset->id}}/edit'> [{{trans('wzoj.edit')}}] </a>
	    @endcan
	</td>
    </tr>
@endforeach
</table>

</div>
@endsection
