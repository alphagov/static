class ApplicationController < ActionController::Base
  protect_from_forgery

protected

  def error_404
    head :not_found
  end
end
