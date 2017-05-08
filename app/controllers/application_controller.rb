class ApplicationController < ActionController::Base
  protect_from_forgery

protected

  def error_404
    render nothing: true, status: :not_found
  end
end
