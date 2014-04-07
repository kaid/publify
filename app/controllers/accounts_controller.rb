class AccountsController < ApplicationController

  before_filter :verify_config
  before_filter :verify_users, only: [:login]
  before_filter :redirect_if_already_logged_in, only: :login

  def index
    redirect_to action: 'login'
  end

  def login
    return unless request.post?
    self.current_user = User.authenticate(params[:user][:login], params[:user][:password])
    if logged_in?
      successful_login
    else
      flash[:error] = t('accounts.login.error')
      @login = params[:user][:login]
    end
  end

  def logout
    flash[:notice] = t('accounts.logout.notice')
    self.current_user.forget_me
    self.current_user = nil
    session[:user_id] = nil
    cookies.delete :auth_token
    cookies.delete :publify_user_profile
    redirect_to :action => 'login'
  end

  private

  def verify_users
    redirect_to(controller: "accounts", action: "signup") if User.count == 0
    true
  end

  def verify_config
    redirect_to controller: "setup", action: "index" unless this_blog.configured?
  end

  def redirect_if_already_logged_in
    if session[:user_id] && session[:user_id] == self.current_user.id
      redirect_back_or_default
    end
  end

  def successful_login
    session[:user_id] = self.current_user.id
    if params[:remember_me] == "1"
      self.current_user.remember_me unless self.current_user.remember_token?
      cookies[:auth_token] = {
        :value => self.current_user.remember_token,
        :expires => self.current_user.remember_token_expires_at,
        :httponly => true # Help prevent auth_token theft.
      }
    end
    add_to_cookies(:publify_user_profile, self.current_user.profile_label, '/')

    self.current_user.update_connection_time
    flash[:success] = t('accounts.login.success')
    redirect_back_or_default
  end

  def redirect_back_or_default
    redirect_to(session[:return_to] || {controller: "admin/dashboard", action: "index"})
    session[:return_to] = nil
  end
end
