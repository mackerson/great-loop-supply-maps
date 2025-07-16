import { Template, TemplateRegistry } from './templates'
import { greatLoopTemplate } from './templates/great-loop'
import { appalachianTrailTemplate } from './templates/appalachian-trail'

class TemplateRegistryImpl implements TemplateRegistry {
  private _templates: Template[] = []

  get templates(): Template[] {
    return this._templates
  }

  getTemplate(id: string): Template | undefined {
    return this._templates.find(template => template.id === id)
  }

  getTemplatesByCategory(category: string): Template[] {
    return this._templates.filter(template => template.category === category)
  }

  getTemplatesByCommunity(community: string): Template[] {
    return this._templates.filter(template => template.community === community)
  }

  registerTemplate(template: Template): void {
    // Remove existing template with same ID
    this._templates = this._templates.filter(t => t.id !== template.id)
    // Add new template
    this._templates.push(template)
  }

  // Helper methods
  getJourneyTemplates(): Template[] {
    return this.getTemplatesByCategory('journey')
  }

  getRelationshipTemplates(): Template[] {
    return this.getTemplatesByCategory('relationship')
  }

  getStoryTemplates(): Template[] {
    return this.getTemplatesByCategory('story')
  }

  // Initialize with default templates
  initialize(): void {
    // Register default templates
    this.registerTemplate(greatLoopTemplate)
    this.registerTemplate(appalachianTrailTemplate)
    
    // Future templates will be registered here
  }
}

// Export singleton instance
export const templateRegistry = new TemplateRegistryImpl()

// Initialize on module load
templateRegistry.initialize() 