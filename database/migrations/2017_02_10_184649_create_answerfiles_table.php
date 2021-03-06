<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAnswerfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('answerfiles', function (Blueprint $table) {
            $table->increments('id');

	    $table->integer('user_id')->index();
	    $table->integer('problemset_id');
	    $table->integer('problem_id');

	    $table->integer('solution_id')->index();
	    $table->string('filename');
	    $table->longText('answer');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('answerfiles');
    }
}
