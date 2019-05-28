class CacheRoutesController < ApplicationController

  def cachable_routes
    ["hello"]
  end

protected

  def error_404
    head :not_found
  end
end
