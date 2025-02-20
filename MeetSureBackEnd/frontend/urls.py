from django.contrib import admin
from django.urls import path, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # 匹配所有路徑，除非以 /admin/ 開頭，指向 React 的 index.html
    re_path(r'^(?!admin/).*$', TemplateView.as_view(template_name='index.html')), 
    path('', include('myapp.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
