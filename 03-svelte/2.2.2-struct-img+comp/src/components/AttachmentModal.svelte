<script>
// @ts-nocheck
    
    import { onMount } from 'svelte';
    import UIkit from 'uikit';
    import { imageCache } from '../lib/cacheService';

    export let idTask;
    export let attachments;

    function deleteAttachment(index) {
      attachments = attachments.filter((_, i) => i !== index);
    }

    function deleteAttach(index) {
      UIkit.modal.confirm('Are you sure you want to delete this attachment?').then(
        function () {
          deleteAttachment(index);
        }
      );
    }

    //const basePath = '/srcMin/';
    const basePath = '/compress/';
    const getImagePath = (filename) => `${basePath}${filename}`;


    let hasImageAttachments = false;
    let hasFilesAttachments = false;

    onMount(async () => {
        try {
            if(attachments != null){
                hasImageAttachments = attachments.some(att => att.type === "IMAGE");
                hasFilesAttachments = attachments.some(att => att.type !== "IMAGE");
            }
        } catch (error) {
            console.error('Failed to fetch attachments:', error);
        }

    });

    onMount(() => {
      imageCache.loadImages(attachments);
    });
  </script>
  
  <div id="attach{idTask}" uk-modal>
    <div class="uk-modal-dialog">
      <button class="uk-modal-close-default" type="button" uk-close></button>
      <form>
      <div class="uk-modal-header">
          <h2 class="uk-modal-title">Manage attachements</h2>
      </div>
        <fieldset class="uk-fieldset">
          <div class="uk-modal-body">
            {#if attachments  != null}
            {#if hasImageAttachments}
            <div class="uk-width-1-1">
              <h3>Delete images:</h3>
            </div>
            
            <div class="slider uk-width-expand uk-flex uk-flex-center"><!---->
              <div uk-slider>
                <div class="uk-position-relative uk-visible-toggle uk-light" tabindex="-1">
                  <div class="uk-slider-items uk-child-width-1-2 uk-child-width-1-3@s uk-child-width-1-4@m">
                    {#each attachments  || [] as attachement}
                        {#if attachement.type == "IMAGE"}
                                <div>
                                    <canvas></canvas>
                                    <img  class="uk-blend-soft-light" src={$imageCache.cachedImages[attachement.path] || getImagePath(attachement.path)} alt="" uk-cover/> <!--src\{attachement.path_compress}-->
                                    <!-- svelte-ignore a11y-missing-attribute -->
                                    <div class="uk-position-center uk-panel">
                                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                                        <span uk-icon="icon: trash; ratio: 1.3;" on:click|preventDefault={() => deleteAttach(attachement.id)} class="delAttach{idTask} uk-icon-button"></span>
                                    </div>
                                </div>
                        {/if}
                    {/each}
                  </div>
                  <!-- svelte-ignore a11y-missing-content -->
                  <a class="uk-position-center-left uk-position-small uk-hidden-hover" href uk-slidenav-previous uk-slider-item="previous"></a>
                  <!-- svelte-ignore a11y-missing-content -->
                  <a class="uk-position-center-right uk-position-small uk-hidden-hover" href uk-slidenav-next uk-slider-item="next"></a>
                </div>
                <ul class="uk-slider-nav uk-dotnav uk-flex-center uk-margin"></ul>
              </div>

            </div>
            {/if}
            {#if hasFilesAttachments}
            <div class="uk-width-1-1">
              <h3>Delete files:</h3>
            </div>
            <div class="uk-child-width-expand@s uk-text-left" uk-grid>
                {#each attachments  || [] as attachement}
                    {#if attachement.type != "IMAGE"}
                        <div class="uk-text-truncate">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <!-- svelte-ignore a11y-missing-content -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <span uk-icon="icon: trash; ratio: 1;" on:click={() => deleteAttachment(attachement.id)}
                            class="uk-icon-button"></span> 
                            {attachement.path}
                        </div>
                    {/if}
                {/each}
            </div>
            {/if}
            {/if}
            <div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
              <div class="uk-margin">
                <legend>Add new files:</legend>
                <div uk-form-custom>
                  <input type="file" aria-label="Custom controls">
                  <button class="uk-button uk-button-default" type="button" tabindex="-1">Select files</button>
                </div>
              </div>
            </div>
          </div>
          <div class="uk-modal-footer uk-text-right">
              <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
              <button class="uk-button uk-button-primary" type="submit">Save</button>
          </div>
        </fieldset>
      </form>

    </div>
</div>
  