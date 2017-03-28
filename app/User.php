<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

class User extends Model implements AuthenticatableContract,
                                    AuthorizableContract,
                                    CanResetPasswordContract
{
    use Authenticatable, Authorizable, CanResetPassword;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'email', 'fullname', 'fullname_lock', 'class', 'class_lock', 'password'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['password', 'remember_token'];

    public function groups(){
	    return $this->belongsToMany('App\Group');
    }

    public function roles(){
	    return $this->belongsToMany('App\Role');
    }

    public function has_role($role){
	    static $roles = [];
	    if(isset($roles[$role])){
		    return $roles[$role];
	    }else{
	    	return $roles[$role] = $this->roles()->where('name',$role)->count()>0;
	    }
    }

    public function solutions(){
	    return $this->hasMany('App\Solution');
    }

    public function judged_solutions(){
	    return $this->hasMany('App\Solution', 'judger_id');
    }

    public function answerfiles(){
	    return $this->hasMany('App\Answerfile');
    }

    public function files(){
	    return $this->hasMany('App\File');
    }

    public function update_cnt_ac(){
	    $this->cnt_ac = $this->solutions()
	    			->distinct('problem_id')
	    			->where('score', '>=', 100)
	    			->count('problem_id');
	    $this->save();
    }

    public function scopeWithoutAdmin($query){
	    return $query->whereNotIn('id', function($query){
			    $query->select('user_id')
			          ->from('role_user')
				  ->where('role_id', 1);//role_id 1 must be admin
		});
    }

    public function isbot($v){
	    User::where('id', $this->id)->increment('bot_tendency', $v);
    }
}
