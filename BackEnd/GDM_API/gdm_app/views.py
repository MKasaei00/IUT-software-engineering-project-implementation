from django.shortcuts import render
from rest_framework import viewsets
from .serializers import ProjectSerializer
from .models import Project, ProjectManager, TeamManager, TeamMember

# Create your views here.

class ProjectView(viewsets.ModelViewSet):

    serializer_class = ProjectSerializer
    #queryset = Project.objects.all()
    def get_queryset(self):
        total = set()
        for e in ProjectManager.objects.filter(base_user__exact=self.request.user):
            total.add(e.project)
        for e in TeamManager.objects.filter(base_user__exact=self.request.user):
            total.add(e.team.project)
        for e in TeamMember.objects.filter(base_user__exact=self.request.user):
            total.add(e.team.project)
        return total


    def get_serializer_context(self):
        context = super().get_serializer_context()

        for e in ProjectManager.objects.filter(base_user__exact=self.request.user):
            if e.project.id in context:
                context[e.project.id] += ["Project Manager"]
            else:
                context[e.project.id] = ["Project Manager"]
        for e in TeamManager.objects.filter(base_user__exact=self.request.user):
            if e.team.project.id in context:
                context[e.team.project.id] += ["Team Manager"]
            else:
                context[e.team.project.id] = ["Team Manager"]
        for e in TeamMember.objects.filter(base_user__exact=self.request.user):
            if e.team.project.id in context:
                context[e.team.project.id] += ["Team Member"]
            else:
                context[e.team.project.id] = ["Team Member"]
        return context
            
        
    